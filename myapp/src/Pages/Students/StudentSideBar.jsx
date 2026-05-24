// import {
//     AppstoreOutlined,
//     GithubOutlined,
//     ProfileOutlined,
//     CalendarOutlined,
//     ExceptionOutlined,
//     MailOutlined,
//     LogoutOutlined,
//     TeamOutlined,
//   } from "@ant-design/icons";
//   import { Menu } from "antd";
//   import { Navigate, useNavigate } from "react-router-dom";
  
//   function StudentSideBar() {
//     const navigate = useNavigate ()
//     return (
//       <div className="SideMenu">
//         <Menu
//          className="SideMenuVertical"
//         mode="vertical"
//         onClick={(item)=>{
//           //items.key
//           navigate(item.key)
//         }}
//             items={[
//             {
//               label: "Home",
//               icon: <AppstoreOutlined 
//               style={{
//                 color: "#1890ff",
//                 fontSize: "1.5rem",
//               }}
//             />,
//               key: "/student",
//             },
//             {
//               label: "Projects",
//               key: "/student/studentprojects",
//               icon: <ProfileOutlined 
//               style={{
//                 color: "#1890ff",
//                 fontSize: "1.5rem",
//               }} />,
//             },
//             {
//               label: "Events",
//               key: "/student/studentevents",
//               icon: <CalendarOutlined 
//               style={{
//                 color: "#1890ff",
//                 fontSize: "1.5rem",
//               }} />,
//             },
//             {
//               label: "Group",
//               key: "/student/group",
//               icon: <TeamOutlined
//               style={{
//                 color: "#1890ff",
//                 fontSize: "1.5rem",
//               }} />,
//             },
//             {
//               label: "GitHub",
//               key: "/student/github",
//               icon: <GithubOutlined
//               style={{
//                 color: "#1890ff",
//                 fontSize: "1.5rem",
//               }} />,
//             },
//             {
//               label: "CollaHub",
//               key: "/student/community",
//               icon: <TeamOutlined
//               style={{
//                 color: "#1890ff",
//                 fontSize: "1.5rem",
//               }} />,
//             },
//             {
//               label: "Report",
//               key: "/student/studentreport",
//               icon: <ExceptionOutlined 
//               style={{
//                 color: "#1890ff",
//                 fontSize: "1.5rem",
//               }} />,
//             },
            
//             {
//               label: "Logout",
//               key: "/student/studentlogout",
//               icon: <LogoutOutlined 
//               style={{
//                 color: "#1890ff",
//                 fontSize: "1.5rem",
//               }} />,
//             },
            
//           ]}
//         ></Menu>
//       </div>
//     );
//   }

// CompleteLayout.jsx - One file with all components and styles

import {
  AppstoreOutlined,
  GithubOutlined,
  ProfileOutlined,
  CalendarOutlined,
  ExceptionOutlined,
  LogoutOutlined,
  TeamOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu, Avatar, Badge, Dropdown, Space, Typography } from "antd";
import { useNavigate, BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

const { Title } = Typography;

// ============================================
// STYLES - Embedded CSS-in-JS
// ============================================
const layoutStyles = {
  container: {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    gridTemplateRows: "64px 1fr",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    margin: 0,
    padding: 0,
  },
  header: {
    gridColumn: "1 / -1",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
    borderBottom: "1px solid #f0f0f0",
    display: "flex",
    alignItems: "center",
    padding: "0 24px",
    zIndex: 10,
  },
  sidebar: {
    gridRow: "2 / 3",
    background: "#fff",
    borderRight: "1px solid #f0f0f0",
    overflowY: "auto",
    height: "100%",
  },
  mainContent: {
    gridRow: "2 / 3",
    overflowY: "auto",
    padding: "24px",
    background: "#f5f5f5",
  },
};

const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  .SideMenu {
    height: 100%;
  }
  
  .SideMenuVertical {
    height: 100%;
    border-right: none !important;
  }
  
  /* Custom scrollbar */
  .sidebar-scroll::-webkit-scrollbar,
  .main-scroll::-webkit-scrollbar {
    width: 6px;
  }
  
  .sidebar-scroll::-webkit-scrollbar-track,
  .main-scroll::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  .sidebar-scroll::-webkit-scrollbar-thumb,
  .main-scroll::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  .sidebar-scroll::-webkit-scrollbar-thumb:hover,
  .main-scroll::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .responsive-sidebar {
      display: none;
    }
    .responsive-main {
      grid-column: 1 / -1 !important;
    }
  }
`;

// ============================================
// HEADER COMPONENT
// ============================================
function Header() {
  const userMenu = {
    items: [
      { key: "profile", label: "Profile" },
      { key: "settings", label: "Settings" },
      { type: "divider" },
      { key: "logout", label: "Logout", danger: true },
    ],
  };

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
        Student Portal
      </Title>
      <Space size="large">
        <Badge count={3} size="small">
          <BellOutlined style={{ fontSize: "20px", cursor: "pointer" }} />
        </Badge>
        <Dropdown menu={userMenu} placement="bottomRight">
          <Avatar icon={<UserOutlined />} style={{ cursor: "pointer", backgroundColor: "#1890ff" }} />
        </Dropdown>
      </Space>
    </div>
  );
}

// ============================================
// STUDENT SIDEBAR COMPONENT (YOUR ORIGINAL)
// ============================================
function StudentSideBar() {
  const navigate = useNavigate();
  
  return (
    <div className="SideMenu">
      <Menu
        className="SideMenuVertical"
        mode="vertical"
        onClick={(item) => {
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
            key: "/student",
          },
          {
            label: "Projects",
            key: "/student/studentprojects",
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
            key: "/student/studentevents",
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
            label: "Group",
            key: "/student/group",
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
            label: "GitHub",
            key: "/student/github",
            icon: (
              <GithubOutlined
                style={{
                  color: "#1890ff",
                  fontSize: "1.5rem",
                }}
              />
            ),
          },
          {
            label: "CollaHub",
            key: "/student/community",
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
            label: "Report",
            key: "/student/studentreport",
            icon: (
              <ExceptionOutlined
                style={{
                  color: "#1890ff",
                  fontSize: "1.5rem",
                }}
              />
            ),
          },
          {
            label: "Logout",
            key: "/student/studentlogout",
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
      />
    </div>
  );
}

// ============================================
// MAIN LAYOUT COMPONENT
// ============================================
function MainLayout({ children }) {
  return (
    <div style={layoutStyles.container}>
      <div style={layoutStyles.header}>
        <Header />
      </div>
      <div className="sidebar-scroll" style={layoutStyles.sidebar}>
        <StudentSideBar />
      </div>
      <div className="main-scroll" style={layoutStyles.mainContent}>
        {children}
      </div>
    </div>
  );
}

// ============================================
// PAGE COMPONENTS (Placeholders)
// ============================================
function StudentDashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your student dashboard!</p>
    </div>
  );
}

function StudentProjects() {
  return (
    <div>
      <h1>Projects</h1>
      <p>View and manage your projects here.</p>
    </div>
  );
}

function StudentEvents() {
  return (
    <div>
      <h1>Events</h1>
      <p>Upcoming events and activities.</p>
    </div>
  );
}

function StudentGroup() {
  return (
    <div>
      <h1>Group</h1>
      <p>Your study groups and collaborations.</p>
    </div>
  );
}

function StudentGithub() {
  return (
    <div>
      <h1>GitHub</h1>
      <p>Connect and manage your GitHub repositories.</p>
    </div>
  );
}

function StudentCommunity() {
  return (
    <div>
      <h1>CollaHub Community</h1>
      <p>Connect with other students and collaborators.</p>
    </div>
  );
}

function StudentReport() {
  return (
    <div>
      <h1>Report</h1>
      <p>Generate and view your reports.</p>
    </div>
  );
}

function StudentLogout() {
  return (
    <div>
      <h1>Logout</h1>
      <p>You have been logged out successfully.</p>
    </div>
  );
}

// ============================================
// LAYOUT WRAPPER FOR STUDENT ROUTES
// ============================================
function StudentLayout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

// ============================================
// MAIN APP COMPONENT WITH ROUTING
// ============================================
// function CompleteLayout() {
//   return (
//     <>
//       {/* Inject global styles */}
//       <style>{globalStyles}</style>
      
//       <Router>
//         <Routes>
//           <Route element={<StudentLayout />}>
//             <Route path="/student" element={<StudentDashboard />} />
//             <Route path="/student/studentprojects" element={<StudentProjects />} />
//             <Route path="/student/studentevents" element={<StudentEvents />} />
//             <Route path="/student/group" element={<StudentGroup />} />
//             <Route path="/student/github" element={<StudentGithub />} />
//             <Route path="/student/community" element={<StudentCommunity />} />
//             <Route path="/student/studentreport" element={<StudentReport />} />
//             <Route path="/student/studentlogout" element={<StudentLogout />} />
//           </Route>
//         </Routes>
//       </Router>
//     </>
//   );
//}

   export default StudentSideBar;
