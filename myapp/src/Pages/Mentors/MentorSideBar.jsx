import {
    AppstoreOutlined,
    HddOutlined,
    ProfileOutlined,
    CalendarOutlined,
    ExceptionOutlined,
    MailOutlined,
    LogoutOutlined,
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
                color: "blue",
                backgroundColor: "rgb(#4B91FF)",
                fontSize: "20px",
                marginLeft:"20px",
              }}
              />,
              key: "/supervisor",
            },
            {
              label: "Projects",
              key: "/supervisor/mentorprojects",
              icon: <ProfileOutlined 
              style={{
                color: "blue",
                backgroundColor: "rgb(#4B91FF)",
                fontSize: "20px",
                marginLeft:"20px",
              }}/>,
            },
            {
              label: "Schedule Meeting",
              key: "/supervisor/schedulemeeting",
              icon: <CalendarOutlined 
              style={{
                color: "blue",
                backgroundColor: "rgb(#4B91FF)",
                fontSize: "20px",
                marginLeft:"20px",
              }}/>,
            },
            {
              label: "Events",
              key: "/supervisor/mentorevents",
              icon: <CalendarOutlined 
              style={{
                color: "blue",
                backgroundColor: "rgb(#4B91FF)",
                fontSize: "20px",
                marginLeft:"20px",
              }}/>,
            },
            {
              label: "Report",
              key: "/supervisor/mentoreport",
              icon: <ExceptionOutlined
              style={{
                color: "blue",
                backgroundColor: "rgb(#4B91FF)",
                fontSize: "20px",
                marginLeft:"20px",
              }} />,
            },
          
            {
              label: "Logout",
              key: "/supervisor/mentorlogout",
              icon: <LogoutOutlined 
              style={{
                color: "blue",
                backgroundColor: "rgb(#4B91FF)",
                fontSize: "20px",
                marginLeft:"20px",
              }}/>,
            },
            
          ]}
        ></Menu>
      </div>
    );
  }
  export default MentorSideBar;
  
  