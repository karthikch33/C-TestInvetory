import { Menu, Layout, Dropdown } from "antd";
import { LiaUserCircleSolid } from "react-icons/lia";
import './SideMenu.css'
import { MdOutlinePerson } from "react-icons/md";
import { GoSignOut } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../features/theme/themeSlice";
import { BsSun, BsMoon } from "react-icons/bs";


const { Sider } = Layout;
export default function SideMenu({ collapsed, selectedKey, handleMenuClick, items }) {

  
  const profileItems = [
    { key: "/username", label: "Karthik Aditya", icon : <MdOutlinePerson /> },
    { key: "/signout", icon: <GoSignOut />, label: "Sign Out" },
  ];  

  const isDark = useSelector((state) => state.theme.isDark);
  const dispatch = useDispatch();

  return (
   <Sider trigger={null} collapsible collapsed={collapsed}>

  {/* MENU */}
  <Menu
    theme="light"
    mode="inline"
    selectedKeys={[selectedKey]}
    onClick={handleMenuClick}
    items={items}
  />

  {/* FOOTER AREA: TOGGLE + PROFILE */}
  <div className="sidebar-footer">
    {/* THEME TOGGLE */}
    <div 
      className="theme-toggle" 
      onClick={() => dispatch(toggleTheme())}
    >
      {isDark 
      ? <BsSun size={22} color="var(--text)" /> 
      : <BsMoon size={22} color="var(--text)" />
    }
    </div>

    {/* PROFILE SECTION */}
    <div className={`sidebar-profile ${collapsed ? "collapsed" : ""}`}>
      <Dropdown
        placement="topRight"
        menu={{ items: collapsed ? profileItems : [] }}
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
