import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  model: {},
  request: {},
  locale: {
    default: 'zh-CN',
    antd: true,
  },
  routes: [
    {
      path: '/',
      component: '@/layouts/BasicLayout',
      routes: [{ path: '/', component: '@/pages/Home', name: '首页' }],
    },
  ],
  proxy: {
    '/api': {
      target: 'http://localhost:8787',
      changeOrigin: true,
    },
  },
  // 不使用 UMI 内置的 tailwindcss 插件，手动通过 PostCSS 配置 Tailwind v4
  extraPostCSSPlugins: [],
  npmClient: 'pnpm',
});
