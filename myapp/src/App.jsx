import "./App.css";
import Login from "./Components/Login";
import ContactUs from "./Components/ContactUs";
import Signup from "./Components/Signup";
import HODHomePage from "./Pages/HOD/HODHomePage";
import MentorHomePage from "./Pages/Mentors/MentorHomepage";
import StudentHomePage from "./Pages/Students/StudentHomePage";
import Homepage from "./Components/Homepage";
import AboutUs from "./Components/AboutUs";
import PrivacyPolicy from "./Components/Privacypolicy";
import ForgotPassword from "./Components/forgotPassword";
import ResetPassword from "./Components/resetPassword";
import {Routes, Route} from "react-router-dom";

function App() {
  return (

    
    <>
    <Routes>
    <Route path= "/" element={<Homepage />} />
      <Route path = "/homepage" element = {<Homepage />} />
      <Route path = "/contactus" element = {<ContactUs />} />
      <Route path = "/privacy_policy" element = {<PrivacyPolicy />} />
      <Route path = "/aboutus" element = {<AboutUs />} />
      <Route path = "/signup" element = {<Signup />} />
      <Route path = "/login" element = {<Login />} />
      <Route path = "/admin/*" element = {<HODHomePage />} />
      <Route path = "/supervisor/*" element = {<MentorHomePage />} />
      <Route path = "/student/*" element = {<StudentHomePage />} />
      <Route path = "/forgot-password" element = {<ForgotPassword />} />
      <Route path = "/reset-password" element = {<ResetPassword />} />
      </Routes>
    </>
  );
}



export default App;
