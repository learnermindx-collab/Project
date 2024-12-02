import React from "react";
import { Typography, Layout, Card } from "antd";
import Footerpage from "../Components/Footerpage";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const PrivacyPolicy = () => {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      minHeight: "80vh",
      backgroundColor: "#f0f2f5",
    },
    card: {
      maxWidth: "800px",
      width: "80%",
      padding: "20px",
      background: "#fff",
      borderRadius: "8px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    },
    title: {
      textAlign: "center",
      color: "#1890ff",
      marginBottom: "20px",
    },
    paragraph: {
      marginBottom: "16px",
    },
    sectionTitle: {
      marginTop: "20px",
    },
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={styles.container}>
        <Card style={styles.card}>
          <Title level={1} style={styles.title}>
            Privacy Policy
          </Title>
          <Paragraph style={styles.paragraph}>
            <Paragraph>
              Welcome to our educational website for FYP (Final Year Project)
              management. Your privacy is important to us. This Privacy Policy
              outlines how we collect, use, and protect your information when
              you use our platform.
            </Paragraph>
          </Paragraph>
          <Title level={4} style={styles.sectionTitle}>
            1. Information We Collect
          </Title>
          <Paragraph style={styles.paragraph}>
            We may collect personal information like your name, email address,
            phone number, and other details you provide while using our website.
          </Paragraph>
          <Title level={4} style={styles.sectionTitle}>
            2. How We Use Your Information
          </Title>
          <Paragraph style={styles.paragraph}>
          We use the collected information to: <br/> 
        - Facilitate communication between students, mentors, and administrators.<br/>  
        - Manage and track project submissions and progress. <br/>
        - Provide a secure and personalized user experience.  <br/>
        - Respond to user queries and provide support.  
          </Paragraph>
          <Title level={4} style={styles.sectionTitle}>
            3. Sharing Your Information
          </Title>
          <Paragraph style={styles.paragraph}>
            We do not share your information with third parties, except as
            required by law or with your explicit consent.
          </Paragraph>
          <Title level={4} style={styles.sectionTitle}>
            4. Security
          </Title>
          <Paragraph style={styles.paragraph}>
            We implement security measures to protect your data. However, no
            method of transmission over the Internet is 100% secure.
          </Paragraph>
          <Title level={4} style={styles.sectionTitle}>
            5. Contact Us
          </Title>
          <Paragraph style={styles.paragraph}>
            If you have any questions or concerns about our privacy policy,
            please contact us at collabora24@gmail.com.
          </Paragraph>
        </Card>
      </Content>
      <Footerpage />
    </Layout>
  );
};

export default PrivacyPolicy;
