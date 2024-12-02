import React from "react";
import { Typography, Card, Row, Col, Avatar } from "antd";
import Footerpage from "../Components/Footerpage";

const { Title, Paragraph } = Typography;

const AboutUs = () => {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <Title className="homecss" style={styles.heroHeading}>
          Welcome to Collabora
        </Title>
        <Paragraph style={styles.heroParagraph}>
          We are committed to providing excellence through our services and
          <br />
          offerings. Learn more about our journey, mission, and the team that
          drives our success.
        </Paragraph>
      </section>

      {/* Our Mission Section */}
      <section style={styles.section}>
        <Title className="homecss" level={1} style={styles.sectionHeading}>
          Our Mission
        </Title>
        <Paragraph style={styles.sectionParagraph}>
          At Collabora, our mission is to revolutionize the Final Year Project
          (FYP) management process by creating a seamless, collaborative, and
          efficient platform for students, mentors, and educators.
        </Paragraph>
      </section>

      {/* Why Choose Us Section */}
      <section style={styles.whyChooseUs}>
        <Title className="homecss" level={1} style={styles.whyChooseUsHeading}>
          Why Choose Us?
        </Title>
        <Row gutter={[16, 16]} justify="center">
          <Col md={8}>
            <Card style={styles.card}>
              <Title level={4}>Enable Real-Time Collaboration</Title>
              <Paragraph>
                Foster a collaborative environment where feedback, discussions,
                and resources are shared instantly to ensure projects progress
                smoothly.
              </Paragraph>
            </Card>
          </Col>
          <Col  md={8}>
            <Card style={styles.card}>
              <Title level={4}>Promote Excellence</Title>
              <Paragraph>
                Equip students with the tools they need to achieve academic
                success and deliver outstanding projects, while enabling mentors
                to provide valuable guidance.
              </Paragraph>
            </Card>
          </Col>
          <Col  md={8}>
            <Card style={styles.card}>
              <Title level={4}>Simplify Project Management</Title>
              <Paragraph>
                Provide a centralized space where students and mentors can
                manage their FYP journey effortlessly, from idea conception to
                project completion.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </section>

      {/* Meet Our Team Section */}
      <section style={styles.teamSection}>
        <Title className="homecss" level={1} style={styles.sectionHeading}>
          Meet Our Team
        </Title>
        <Row gutter={[16, 16]} justify="center">
          <Col  lg={4}>
            <div style={styles.avatarContainer}>
              <Avatar
                size={150}
                src="team1.png"
              />
              <Paragraph style={styles.avatarName}>Samaiya</Paragraph>
            </div>
          </Col>
          <Col  lg={4}>
            <div style={styles.avatarContainer}>
              <Avatar
                size={150}
                src="team2.png"
              />
              <Paragraph style={styles.avatarName}>Fareeha</Paragraph>
            </div>
          </Col>
        </Row>
      </section>
      <Footerpage />
    </div>
  );
};

// Inline CSS Styles
const styles = {
  container: {
    padding: "10px",
    backgroundColor: "#f9f9f9",
  },
  heroSection: {
    textAlign: "center",
    padding: "40px 20px",
    background: "linear-gradient(135deg, #60C2E1, #264BAE)", // Blue background
    color: "#fff",
  },
  heroHeading: {
    fontSize: "40px",
    fontWeight: "bold",
    color: "white",
  },
  heroParagraph: {
    fontSize: "18px",
    marginTop: "20px",
    color: "white",
  },
  section: {
    padding: "40px 20px",
    textAlign: "center",
    backgroundColor: "#fff",
  },
  sectionHeading: {
    marginBottom: "40px",
    fontSize: "40px",
    textAlign: "center",
  },
  sectionParagraph: {
    maxWidth: "800px",
    margin: "0 auto 40px auto",
    fontSize: "18px",
    lineHeight: "1.6",
  },
  whyChooseUs: {
    padding: "40px 20px",
    backgroundColor: "#1890ff", // Blue background
    color: "#4D96FF",
  },
  whyChooseUsHeading: {
    color: "white",
    textAlign: "center",
    marginBottom: "30px",
  },
  card: {
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
  },
  teamSection: {
    padding: "40px 20px",
    backgroundColor: "#fff",
  },
  avatarContainer: {
    textAlign: "center",
    
  },
  avatarName: {
    marginTop: "10px",
    fontSize: "20px",
    fontWeight: "bold",
  },
};

export default AboutUs;
