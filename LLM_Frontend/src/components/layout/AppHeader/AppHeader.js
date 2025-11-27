import { Header } from "antd/es/layout/layout";
import { GiHamburgerMenu } from "react-icons/gi";
import { LiaUserCircleSolid } from "react-icons/lia";
import { Dropdown, Menu, Button } from "antd";

export default function AppHeader({ collapsed, setCollapsed }){

  const profileItems = [
    { key: "/username", label: "Karthik Aditya" },
    { key: "/signout", icon: <i className="fas fa-sign-out-alt" />, label: "Sign Out" },
  ];  

  return (
    <Header style={{ padding: 0, maxHeight: "50px" }} className="d-flex ps-3 pe-5">
      <div style={{ display: "flex", alignItems: "center", justifyContent : "space-between", width: "100%" }}>
        <div>
          <img
            src="https://mma.prnewswire.com/media/844530/YASH_Technologies_Logo.jpg?p=publish"
            className="rounded-circle"
            alt="logo"
            style={{ width: "45px", height: "45px" }}
          />

          <Button
            type="text"
            icon={<GiHamburgerMenu />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              marginLeft: collapsed ? "20px" : "165px",
            }}
          />
        </div>

        <Dropdown
          overlay={
            <Menu>
              {profileItems.map((item) => (
                <Menu.Item key={item.key}>
                  {item.icon} {item.label}
                </Menu.Item>
              ))}
            </Menu>
          }
          placement="bottomRight"
          arrow
        >
          <LiaUserCircleSolid
            style={{ width: "30px", height: "30px", cursor: "pointer" }}
          />
        </Dropdown>
      </div>
    </Header>
  );
}
