import React from "react";

const Footer = () => {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #60C2E1, #264BAE)",
        color: "#fff",
        textAlign: "center",
        padding: "20px",
        position: "relative",
        bottom: "0",
        width: "100%",
      }}
    >
      {/* Reserved Slogan */}
      <div style={{ marginBottom: "10px", fontSize: "14px" }}>
        © 2024 Collabora - All Rights Reserved
      </div>
      {/* Links Section */}
      <div>
        <a
          href="/about"
          style={{ color: "#fff", marginRight: "30px", textDecoration: "none" }}
        >
          About
        </a>
        <a
          href="/contactUs"
          style={{ color: "#fff", marginRight: "30px", textDecoration: "none" }}
        >
          Contact Us
        </a>
        <a href="/privacy" style={{ color: "#fff", textDecoration: "none" }}>
          Privacy Policy
        </a>
      </div>
    </div>
  );
};

export default Footer;
