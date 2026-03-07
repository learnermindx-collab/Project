import React from "react";
import { Route, Routes } from "react-router-dom";
import SideBar from "./SideBar";
import AppHeader from "../../Components/AppHeader";
import AddSupervisor from "./AddSupervisor";
import AddStudent from "./AddStudent";
import Projects from "./Projects";
import Events from "./Events";
import Dashboard from "./Dashboard";
import Logout from "./Logout";
import Issues from "./Issues";
import Community from "../Community";
import Footerpage from "../../Components/Footerpage";

function HODHomePage() {
  return (
    <>
      <div className="App">
        <AppHeader />
        <div className="SideMenuAndPageContent">
          <SideBar />
          <div className="PageContent">
            <Routes>
              <Route path="/" element={<Dashboard />}></Route>
              <Route path="addsupervisor" element={<AddSupervisor />}></Route>
              <Route path="addstudent" element={<AddStudent />}></Route>
              <Route path="projects" element={<Projects />}></Route>
              <Route path="events" element={<Events />}></Route>
              <Route path="community" element={<Community />}></Route>
              <Route path="issues" element={<Issues />}></Route>
              <Route path="logout" element={<Logout />}></Route>
              <Route path="*" element={<div>Page not found.</div>}> </Route>
            </Routes>
          </div>
        </div>
        <Footerpage/>
      </div>
    </>
  );
}

export default HODHomePage;
