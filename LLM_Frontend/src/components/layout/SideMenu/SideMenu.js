import { Menu, Layout } from "antd";
const { Sider } = Layout;

export default function SideMenu({ collapsed, selectedKey, handleMenuClick, items }) {
  return (
    <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
        items={items}
      />
    </Sider>
  );
}
