// import React from 'react';

// function StudentLogout() {
//   return (
//     <div>
//       StudentsLogout
//     </div>
//   );
// }

// export default StudentLogout;
import { useEffect } from "react";
import api from "../../api.js"; 
import { message } from "antd";

function Logout() {
  useEffect(() => {
    const logout = async () => {
      try {
        await api.post("/auth/logout");
      } catch (err) {
        // Even if logout fails, we still clear local state
        console.error("Logout error:", err);
      } finally {
        localStorage.clear();
        message.success("Logged out successfully");
        window.location.href = "/login";
      }

    };

    logout();
  }, []);

  return null; // no UI needed
}

export default Logout;
