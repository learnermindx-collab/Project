import React from "react";
import { Route, Routes } from "react-router-dom";
import AppHeader from "../../Components/AppHeader";
import MentorSideBar from "./MentorSideBar";
import MentorDashboard from "./MentorDashboard";
import MentorProjects from "./MentorProjects";
import MentorEvents from "./MentorEvents";
import Mentorreport from "./Mentorreport";
import MentorLogout from "./MentorLogout";
import Schedulemeeting from "./Schedulemeeting";
import Community from "../Community";
import Footerpage from "../../Components/Footerpage";

function MentorHomePage() {
  return (
    <>
    <div className="App">
      <AppHeader />
      <div className="SideMenuAndPageContent">
        <MentorSideBar />
        <div className="PageContent">
        <Routes>
          <Route path="/" element={<MentorDashboard />}></Route>
          <Route path="mentorprojects" element={<MentorProjects />}></Route>
          <Route path="schedulemeeting" element={<Schedulemeeting />}></Route>
          <Route path="mentorevents" element={<MentorEvents />}></Route>
          <Route path="community" element={<Community />}></Route>
          <Route path="mentoreport" element={<Mentorreport />}></Route>
          <Route path="mentorlogout" element={<MentorLogout />}></Route>
          <Route path="*" element={<div>Page not found.</div>} > </Route>
        </Routes>
        </div>
      </div>
      <Footerpage/>
    </div>
    </>
  );
}

export default MentorHomePage;
