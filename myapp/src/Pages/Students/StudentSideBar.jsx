import {
    AppstoreOutlined,
    GithubOutlined,
    ProfileOutlined,
    CalendarOutlined,
    ExceptionOutlined,
    MailOutlined,
    LogoutOutlined,
  } from "@ant-design/icons";
  import { Menu } from "antd";
  import { Navigate, useNavigate } from "react-router-dom";
  
  function StudentSideBar() {
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
              key: "/student",
            },
            {
              label: "Projects",
              key: "/student/studentprojects",
              icon: <ProfileOutlined
              style={{
                color: "blue",
                backgroundColor: "rgb(#4B91FF)",
                fontSize: "20px",
                marginLeft:"20px",
              }} />,
            },
            {
              label: "Events",
              key: "/student/studentevents",
              icon: <CalendarOutlined 
              style={{
                color: "blue",
                backgroundColor: "rgb(#4B91FF)",
                fontSize: "20px",
                marginLeft:"20px",
              }}/>,
            },
            {
              label: "GitHub",
              key: "/student/github",
              icon: <GithubOutlined
              style={{
                color: "blue",
                backgroundColor: "rgb(#4B91FF)",
                fontSize: "20px",
                marginLeft:"20px",
              }}/>,
            },
            {
              label: "Report",
              key: "/student/studentreport",
              icon: <ExceptionOutlined 
              style={{
                color: "blue",
                backgroundColor: "rgb(#4B91FF)",
                fontSize: "20px",
                marginLeft:"20px",
              }}/>,
            },
            
            {
              label: "Logout",
              key: "/student/studentlogout",
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
  export default StudentSideBar;
  
  