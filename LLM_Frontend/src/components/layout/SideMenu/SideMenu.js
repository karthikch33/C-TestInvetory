import { Menu, Layout, Dropdown } from "antd";
import { LiaUserCircleSolid } from "react-icons/lia";
import './SideMenu.css'
import { MdOutlinePerson } from "react-icons/md";
import { GoSignOut } from "react-icons/go";

const { Sider } = Layout;
export default function SideMenu({ collapsed, selectedKey, handleMenuClick, items }) {

  
  const profileItems = [
    { key: "/username", label: "Karthik Aditya", icon : <MdOutlinePerson /> },
    { key: "/signout", icon: <GoSignOut />, label: "Sign Out" },
  ];  

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
        items ={items}
      />
      <div className="sidebar-profile">
      <div className={`sidebar-profile ${collapsed ? "collapsed-profile" : ""}`}>
      <Dropdown
        placement="topRight"
        menu={{items : collapsed ?  profileItems : []}}
      >
        <LiaUserCircleSolid className="profile-icon" />
      </Dropdown>

      {!collapsed && (
        <div className="profile-info">
          <span className="profile-name">Karthik Aditya</span>
          <span className="profile-role">Logout</span>
        </div>
      )}
    </div>

      </div>
    </Sider>
  );
}
