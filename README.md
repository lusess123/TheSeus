# TheSeus

PNPM Monorepo 全栈项目，前后端分离，部署在 Cloudflare 上。

## 技术栈

| 层         | 技术                                                                |
| ---------- | ------------------------------------------------------------------- |
| 前端框架   | @umijs/max 4.x + React 18                                           |
| UI 组件库  | Ant Design 6                                                        |
| CSS 方案   | Tailwind CSS v4（手动配 `@tailwindcss/postcss`，不用 UMI 内置插件） |
| 样式共存   | `@layer` 分层（tailwind-base < antd < tailwind-utilities）          |
| 后端入口   | Hono.js on Cloudflare Workers（薄层，只负责路由和环境初始化）       |
| 业务逻辑   | `@theseus/server`（框架无关，可移植到 Node/AWS/阿里云）             |
| 数据库     | Prisma 7 + Prisma Postgres                                          |
| 数据访问   | Repository 模式（防腐层），方法名与 Prisma 对齐，支持事务           |
| API 路径   | `/api/v1/`                                                          |
| TypeScript | strict: true                                                        |
| 包管理     | PNPM 9.x（无 Turborepo，原生 workspace）                            |
| Node 版本  | 22 LTS                                                              |

## 项目结构

```
TheSeus/
├── apps/
│   ├── theseus-web/              # @theseus/web - 前端 UMI Max
│   └── theseus-api/              # @theseus/api - 后端 Hono (CF Workers)
├── packages/
│   ├── theseus-shared/           # @theseus/shared - 前后端共享（类型、常量、工具）
│   ├── theseus-server/           # @theseus/server - 核心业务逻辑（框架无关）
│   └── theseus-database/         # @theseus/database - Prisma schema + repos
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── eslint.config.mjs
├── .prettierrc
├── vitest.workspace.ts
└── README.md
```

## 架构分层

```
┌─────────────────┐     ┌─────────────────┐
│  theseus-web    │     │  theseus-api     │
│  (UMI Max)      │────▶│  (Hono/Workers)  │
│  Cloudflare     │ API │  Cloudflare      │
│  Pages          │     │  Workers         │
└─────────────────┘     └────────┬─────────┘
                                 │ 薄层入口
                        ┌────────▼─────────┐
                        │  theseus-server   │
                        │  (业务逻辑层)      │
                        │  框架无关          │
                        └────────┬─────────┘
                                 │
                        ┌────────▼─────────┐
                        │  theseus-database │
                        │  (Prisma + Repos) │
                        └────────┬─────────┘
                                 │
                        ┌────────▼─────────┐
                        │  Prisma Postgres  │
                        └──────────────────┘

  theseus-shared 被所有层共享（类型、常量、工具函数）
```

## 关键设计决策

### 1. 后端分层（入口层 vs 业务层）

`theseus-api` 是薄薄的入口层，只负责：

- Hono 路由绑定
- 环境变量读取
- Prisma Client 创建
- AppContext 组装

`theseus-server` 是框架无关的业务逻辑层，不依赖 Hono/Express/CF Workers。未来换运行时只需新建入口：

```
apps/
  theseus-api/          # Cloudflare Workers 入口
  theseus-api-node/     # Node.js 入口（未来）
  theseus-api-ali/      # 阿里云函数计算入口（未来）
```

### 2. 数据库访问（Repository 模式）

采用 Repository 防腐层，每个表一个 `.repo.ts` 文件：

- 方法名与 Prisma 对齐（findMany, findFirst, create, update, delete）
- 保留完整的 TypeScript 类型推断（include, select 等）
- 支持事务：传入 `tx` 参数则使用事务 Client
- Prisma Client 由外部传入（非单例），适配 Workers 环境

### 3. AppContext 依赖注入

业务层通过 `AppContext` 接收依赖，不直接创建连接：

```ts
interface AppContext {
  db: PrismaClient;
  // 未来可扩展 config, logger, cache 等
}
```

入口层负责组装 Context 并注入。

### 4. 样式方案（Ant Design 6 + Tailwind v4）

使用 CSS `@layer` 分层避免冲突：

- `tailwind-base`（优先级最低）
- `antd`（中间）
- `tailwind-utilities`（优先级最高，可覆盖 antd）

不使用 UMI 内置的 Tailwind 插件（仅支持 v3），改为手动配置 `@tailwindcss/postcss`。

### 5. 前后端联调

- 本地开发：UMI proxy 将 `/api/*` 转发到 `wrangler dev`（localhost:8787）
- 生产环境：不同子域名 + CORS

### 6. 包引用策略

直接引用源码（TS path aliases），不需要 build 各个 package：

```json
{
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    }
  }
}
```

## 工程化

| 工具                   | 用途                         |
| ---------------------- | ---------------------------- |
| ESLint 9 (flat config) | 代码规范检查                 |
| Prettier               | 代码格式化                   |
| husky + lint-staged    | Git 提交时自动 lint + format |
| Vitest                 | 单元测试（前端除外）         |
| tsconfig.base.json     | 共享 TypeScript 配置         |

## 开发命令

```bash
# 安装依赖
pnpm install

# 同时启动前后端开发服务
pnpm dev

# 单独启动
pnpm dev:web          # 前端 (localhost:8000)
pnpm dev:api          # 后端 (localhost:8787)

# 构建
pnpm build

# 代码检查
pnpm lint
pnpm format

# 测试
pnpm test

# 数据库
pnpm --filter @theseus/database db:generate
pnpm --filter @theseus/database db:push
pnpm --filter @theseus/database db:studio
```

## 部署

- **前端**：Cloudflare Pages（构建产物在 `apps/theseus-web/dist/`）
- **后端**：Cloudflare Workers（`pnpm --filter @theseus/api deploy`）
- **数据库**：Prisma Postgres（Prisma 官方托管）

## 环境变量

### 后端（apps/theseus-api）

| 变量           | 说明                     | 设置方式                                   |
| -------------- | ------------------------ | ------------------------------------------ |
| `DATABASE_URL` | Prisma Postgres 连接 URL | 本地: `.dev.vars`，生产: `wrangler secret` |

复制 `.dev.vars.example` 为 `.dev.vars` 并填入真实值。
