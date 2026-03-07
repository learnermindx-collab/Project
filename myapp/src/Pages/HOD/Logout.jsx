// import React from 'react';

// function Logout() {
//   return (
//     <div>
//       <p>Logout</p>
//     </div>
//   );
// }

// export default Logout;
// <p></p>

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
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        message.success("Logged out successfully");
        window.location.href = "/login";
      }
    };

    logout();
  }, []);

  return null; // no UI needed
}

export default Logout;
