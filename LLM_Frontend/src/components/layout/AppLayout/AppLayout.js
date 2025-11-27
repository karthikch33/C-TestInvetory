import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Layout } from "antd";

import AppHeader from "../../layout/AppHeader/AppHeader";
import SideMenu from "../../layout/SideMenu/SideMenu";

const { Content } = Layout;

const items = [
  { key: "/", label: "Home", icon: <i className="fas fa-home" /> },
  { key: "/project/manageprojects", label: "Project", icon: <i className="fas fa-folder" /> },
  { key: "/connections/flatfile", label: "Tables", icon: <i className="fas fa-upload" /> },
  { key: "/workspace", label: "Workspace", icon: <i className="fas fa-briefcase" /> },
];


export default function AppLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const [selectedKey, setSelectedKey] = useState("/");

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
    navigate(e.key);
  };

  return (
    <Layout>
      <ToastContainer position="top-center" autoClose={2500} />
      
      <AppHeader collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout hasSider>
        <SideMenu
          collapsed={collapsed}
          selectedKey={selectedKey}
          handleMenuClick={handleMenuClick}
          items={items}
      />

        <Layout>
          <Content 
          style={{ 
            overflowY:"scroll",
             backgroundRepeat:"no-repeat", 
             backgroundSize:"cover",
              backgroundColor:"#fff",
              backgroundImage: 'url("https://www.yash.com/wp-content/themes/html5blank-stable/images/services/service-offeringBG.png")'
          }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}




