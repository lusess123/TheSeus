import { Layout, Menu } from 'antd';
import { Link, Outlet, useLocation } from '@umijs/max';

const { Header, Content, Sider } = Layout;

export default function BasicLayout() {
  const location = useLocation();

  const menuItems = [{ key: '/', label: <Link to="/">首页</Link> }];

  return (
    <Layout className="min-h-screen">
      <Sider breakpoint="lg" collapsedWidth={0}>
        <div className="p-4 text-center text-white text-lg font-bold">TheSeus</div>
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} items={menuItems} />
      </Sider>
      <Layout>
        <Header className="bg-white px-6 shadow-sm" />
        <Content className="m-6 p-6 bg-white rounded-lg">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
