import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Layout } from "antd";
import { ConfigProvider, theme } from "antd";
import { useSelector } from "react-redux";

import AppHeader from "../../layout/AppHeader/AppHeader";
import SideMenu from "../../layout/SideMenu/SideMenu";
import { FaProjectDiagram, FaUpload } from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";
import { GoHomeFill } from "react-icons/go";

const { Content } = Layout;

const items = [
  { key: "/", label: "Home", icon: <GoHomeFill /> },
  { key: "/project/manageprojects", label: "Project", icon: <FaProjectDiagram /> },
  { key: "/connections/flatfile", label: "Tables", icon: <FaUpload/> },
  { key: "/workspace", label: "Workspace", icon: <MdOutlineWorkOutline /> },
];


export default function AppLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const [selectedKey, setSelectedKey] = useState("/");

  const isDark = useSelector((state) => state.theme.isDark);

    useEffect(() => {
    if (isDark) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [isDark]);


  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
    navigate(e.key);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark
          ? theme.darkAlgorithm
          : theme.defaultAlgorithm,
      }}
    >

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
             backgroundColor: "var(--bg)"
              // backgroundImage: 'url("https://www.yash.com/wp-content/themes/html5blank-stable/images/services/service-offeringBG.png")'
          }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
    </ConfigProvider>
  );
}




