import {
    AppstoreOutlined,
    HddOutlined,
    ProfileOutlined,
    CalendarOutlined,
    ExceptionOutlined,
    MailOutlined,
    LogoutOutlined,
    TeamOutlined,
  } from "@ant-design/icons";
  import { Menu } from "antd";
  import { Navigate, useNavigate } from "react-router-dom";
  
  function MentorSideBar() {
    const navigate = useNavigate ()
    return (
      <div className="SideMenu">
        <Menu
         className="SideMenuVertical"
        mode="vertical"
        onClick={(item)=>{
          //items.key
          navigate(item.key)
        }}
            items={[
            {
              label: "Home",
              icon: <AppstoreOutlined 
              style={{
                color: "#1890ff",
                fontSize: "1.5rem",
              }} />,
              key: "/supervisor",
            },
            {
              label: "Projects",
              key: "/supervisor/mentorprojects",
              icon: <ProfileOutlined 
              style={{
                color: "#1890ff",
                fontSize: "1.5rem",
              }} />,
            },
            {
              label: "Schedule Meeting",
              key: "/supervisor/schedulemeeting",
              icon: <CalendarOutlined 
              style={{
                color: "#1890ff",
                fontSize: "1.5rem",
              }} />,
            },
{
              label: "Events",
              key: "/supervisor/mentorevents",
              icon: <CalendarOutlined 
              style={{
                color: "#1890ff",
                fontSize: "1.5rem",
              }} />,
            },
            {
              label: "CollaHub",
              key: "/supervisor/community",
              icon: <TeamOutlined 
              style={{
                color: "#1890ff",
                fontSize: "1.5rem",
              }} />,
            },
            {
              label: "Report",
              key: "/supervisor/mentoreport",
              icon: <ExceptionOutlined
              style={{
                color: "#1890ff",
                fontSize: "1.5rem",
              }} />,
            },
          
            {
              label: "Logout",
              key: "/supervisor/mentorlogout",
              icon: <LogoutOutlined 
              style={{
                color: "#1890ff",
                fontSize: "1.5rem",
              }} />,
            },
            
          ]}
        ></Menu>
      </div>
    );
  }
  export default MentorSideBar;
  
  