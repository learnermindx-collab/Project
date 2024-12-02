import React from "react";
import { Layout, Menu } from "antd";
import Footerpage from "../Components/Footerpage";
import { Link } from "react-router-dom";

const { Header, Content } = Layout;

const App = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header Section */}
      <Header
        style={{
          backgroundColor: "white", 
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 20px",
        }}
      >
        <div>
          <img
            src="Collabora.png"
            alt="Logo"
            style={{
              height: "60px",
              position: "sticky",
              display: "block",
              margin: "auto",
              justifyContent: "center",
            }}
          />
        </div>
      </Header>

      <Content>
        {/* Hero Section */}
        <section
          style={{
            height: "70vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #60C2E1, #264BAE)",
            color: "white",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <h1
          className="homecss"
            style={{
              fontSize: "3rem",
              marginBottom: "20px",
              animation: "fadeIn 1.5s ease-in-out",
            }}
          >
            Welcome to Collabora
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              marginBottom: "30px",
              animation: "slideUp 5s ease-in-out",
            }}
          >
            At
            <b
              style={{
                fontSize: "20px",
                color: "#264BAD",
              }}
            >
              {" "}
              Collabora
            </b>
            ,We bring you to One Platform,
            <br /> Endless Collaboration – Simplify, Connect, and Complete
            <br /> Your FYP Seamlessly!
          </p>
         <Link to="/signup"> <button
          className="homecss"
            style={{
              padding: "10px 20px",
              fontSize: "2rem",
              color: "#4facfe",
              backgroundColor: "white",
              border: "none",
              borderRadius: "30px",
              cursor: "pointer",
              transition: "transform 0.5s ease, background-color 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "scale(1.1)";
              e.target.style.backgroundColor = "#e0f7fa";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.backgroundColor = "white";
            }}
          >
            Signup
          </button>
          </Link>
          <Link to="/login"> <button
          className="homecss"
            style={{
              padding: "10px 20px",
              fontSize: "2rem",
              color: "#4facfe",
              backgroundColor: "white",
              border: "none",
              borderRadius: "30px",
              cursor: "pointer",
              transition: "transform 0.5s ease, background-color 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "scale(1.1)";
              e.target.style.backgroundColor = "#e0f7fa";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.backgroundColor = "white";
            }}
          >
            Login
          </button>
          </Link>

        </section>

        {/* Features Section */}
        <section
          style={{
            padding: "50px 20px",
            backgroundColor: "#f9f9f9",
            textAlign: "center",
            color: "#4D96FF",
          }}
        >
          <h1
          className="homecss"
            style={{
              marginBottom: "40px",
            }}
          >
             Features
          </h1>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
              margin: "0 auto",
              maxWidth: "1100px",
            }}
          >
            {/* Feature 1 */}
            <div
              style={{
                flex: "1",
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-10px)";
                e.target.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 5px 10px rgba(0, 0, 0, 0.1)";
              }}
            >
              <h2 style={{  marginBottom: "10px" }}>
              Achieve FYP Excellence
              </h2>
              <p style={{ fontSize: "1rem", color: "#555" }}>
              Empowering Teams, Driving Success  Achieve FYP Excellence Together!
              </p>
            </div>

            {/* Feature 2 */}
            <div
              style={{
                flex: "1",
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-10px)";
                e.target.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 5px 10px rgba(0, 0, 0, 0.1)";
              }}
            >
              <h2 style={{  marginBottom: "10px" }}>
                Simplify FYP Management
              </h2>
              <p style={{ fontSize: "1rem", color: "#555" }}>
              Effortless Management, Exceptional<br/> Results  Simplify Your FYP Journey!
              </p>
            </div>

            {/* Feature 3 */}
            <div
              style={{
                flex: "1",
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-10px)";
                e.target.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 5px 10px rgba(0, 0, 0, 0.1)";
              }}
            >
              <h2 style={{  marginBottom: "10px" }}>
              Real-Time Feedback
              </h2>
              <p style={{ fontSize: "1rem", color: "#555" }}>
              Real-Time Feedback, Real-Time Growth Empowering Your FYP Journey!
              </p>
            </div>
          </div>
        </section>
      </Content>
      <Footerpage />
    </Layout>
  );
};

export default App;
