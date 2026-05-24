import {
  AppstoreOutlined,
  HddOutlined,
  IssuesCloseOutlined,
  ProfileOutlined,
  UsergroupAddOutlined,
  UserAddOutlined,
  CalendarOutlined,
  MailOutlined,
  LogoutOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Navigate, useNavigate } from "react-router-dom";

function SideBar() {
  const navigate = useNavigate();
  return (
    <div className="SideMenu">
      <Menu
        className="SideMenuVertical"
        mode="vertical"
        onClick={(item) => {
          //items.key
          navigate(item.key);
        }}
        items={[
          {
            label: "Home",
            icon: (
              <AppstoreOutlined
                style={{
                  color: "#1890ff",
                  fontSize: "1.5rem",
                }}
              />
            ),
            key: "/admin",
          },
          {
            label: "AddSupervisor",
            key: "/admin/addsupervisor",
            icon: (
              <UserAddOutlined
                style={{
                  color: "#1890ff",
                  fontSize: "1.5rem",
                }}
              />
            ),
          },
          {
            label: "AddStudent",
            key: "/admin/addstudent",
            icon: (
              <UsergroupAddOutlined
                style={{
                  color: "#1890ff",
                  fontSize: "1.5rem",
                }}
              />
            ),
          },
          {
            label: "Projects",
            key: "/admin/projects",
            icon: (
              <ProfileOutlined
                style={{
                  color: "#1890ff",
                  fontSize: "1.5rem",
                }}
              />
            ),
          },
{
            label: "Events",
            key: "/admin/events",
            icon: (
              <CalendarOutlined
                style={{
                  color: "#1890ff",
                  fontSize: "1.5rem",
                }}
              />
            ),
          },
          {
            label: "CollaHub",
            key: "/admin/community",
            icon: (
              <TeamOutlined
                style={{
                  color: "#1890ff",
                  fontSize: "1.5rem",
                }}
              />
            ),
          },
          {
            label: "Issues",
            key: "/admin/issues",
            icon: (
              <IssuesCloseOutlined
                style={{
                  color: "#1890ff",
                  fontSize: "1.5rem",
                }}
              />
            ),
          },

          {
            label: "Logout",
            key: "/admin/logout",
            icon: (
              <LogoutOutlined
                style={{
                  color: "#1890ff",
                  fontSize: "1.5rem",
                }}
              />
            ),
          },
        ]}
      ></Menu>
    </div>
  );
}
export default SideBar;
