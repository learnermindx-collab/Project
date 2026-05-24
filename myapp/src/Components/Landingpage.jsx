import React from "react";
import { Typography, Button, Space } from "antd";
const { Title, Paragraph } = Typography;
import { Link } from 'react-router-dom';

const image = "/landing.png";

const LandingPage = () => {
  const styles = {
    landingPage: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      height: "100vh",
      background: image,
      position: "relative",
    },
    textContainer: {
      /* OLD NON-RESPONSIVE: fixed maxWidth, right pos, overflows mobile */
      /* NEW RESPONSIVE: fluid, centered */
      maxWidth: "min(500px, 90vw)",
      margin: "0 auto",
      padding: "clamp(1rem, 4vw, 2rem)",
      borderRadius: "10px",
      backgroundColor: "white",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
      textAlign: "left",
    },
    title: {
      color: "#4D96FF",
      marginTop: "50px",
    },
    paragraph: {
      color: "#4D96FF",
      fontSize: "18px",
    },
    buttonGroup: {
      marginTop: "10px",
      marginBottom: "50px",
    },
  };

  return (
    <div style={styles.landingPage}>
      <div style={styles.textContainer}>
        <Title className="homecss" level={1} style={styles.title}>
          <b>Hi, there! </b>
        </Title>


        <Paragraph className="css" style={styles.paragraph}>
          If you are an Admin then Signup otherwise just Login.
        </Paragraph>

        <Space style={styles.buttonGroup}>
          <Button
            className="css"
            style={{
              backgroundColor: "#4D96FF",
              borderColor: "#4D96FF",
              color: "#fff",
              fontSize: "20px",
              borderRadius: "30px",
            }}
            type="primary"
            size="large"
            onMouseOver={(e) => {
              e.target.style.transform = "scale(1.1)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          >
            Sign Up
          </Button>
          <Button
            className="css"
            style={{
              backgroundColor: "#4D96FF",
              borderColor: "#4D96FF",
              color: "#fff",
              fontSize: "20px",
              borderRadius: "30px",
            }}
            size="large"
            onMouseOver={(e) => {
              e.target.style.transform = "scale(1.1)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          >
            Log In
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default LandingPage;
