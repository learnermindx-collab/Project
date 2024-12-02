import React from "react";
import { Layout, Card, Col, Row, List, Typography } from "antd";
import {
  SmileOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { Content, Sider } = Layout;

const getGreetingMessage = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) return "Good Morning";
  if (currentHour < 18) return "Good Afternoon";
  return "Good Evening";
};

const tasks = 5; // Example: number of tasks assigned by the mentor
const meetings = ["Project Update", "Mentor Review"]; // Example: upcoming meetings
const events = ["Project Deadline", "Team Meeting"]; // Example: upcoming events
const previousDiscussions = [
  {
    title: "Project Documentation",
    description:
      "Documentation should be completed and reviewed after one week.",
    date: "2024-08-18",
  },
  {
    title: "Project Interfaces",
    description: "Interfaces should be ready before the next meeting.",
    date: "2024-08-17",
  },
];

const cardStyle = {
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  fontSize: "16px",
};

const iconStyle = {
  paddingTop:"20px",
  fontSize: "52px", // Increased size of the icons
  marginBottom: "8px", // Space between icon and title
};

const StudentDashboard = () => {
  return (
    <Layout style={{ padding: "24px" }}>
      <Content>
        <Row gutter={[16, 16]}>
          {/* First Row */}
          <Col span={12}>
            <Card
              title={
                <div style={{ textAlign: "center" }}>
                  <SmileOutlined style={{ ...iconStyle, color: "#4D96FF" }} />
                  <Title level={4}>{getGreetingMessage()}</Title>
                </div>
              }
              style={cardStyle}
            >
              <p>Welcome back! Keep up the great work.</p>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title={
                <div style={{ textAlign: "center" }}>
                  <CheckCircleOutlined
                    style={{ ...iconStyle, color: "#4D96FF" }}
                  />
                  <Title level={4}>Assigned Tasks</Title>
                </div>
              }
              style={cardStyle}
            >
              <p>You have {tasks} tasks assigned by your Supervisor.</p>
            </Card>
          </Col>

          {/* Second Row */}
          <Col span={12}>
            <Card
              title={
                <div style={{ textAlign: "center" }}>
                  <ClockCircleOutlined
                    style={{ ...iconStyle, color: "#4D96FF" }}
                  />
                  <Title level={4}>Upcoming Meetings</Title>
                </div>
              }
              style={cardStyle}
            >
              <List
                dataSource={meetings}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title={
                <div style={{ textAlign: "center" }}>
                  <CalendarOutlined
                    style={{ ...iconStyle, color: "#4D96FF" }}
                  />
                  <Title level={4}>Upcoming Events</Title>
                </div>
              }
              style={cardStyle}
            >
              <List
                dataSource={events}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </Card>
          </Col>
        </Row>
      </Content>

      {/* Right Sidebar */}
      <Sider width={300} style={{ background: "#fff", marginLeft: "16px" }}>
        <Title level={4} style={{ padding: "16px" }}>
          Previous Discussions
        </Title>
        {previousDiscussions.map((discussion, index) => (
          <Card
            key={index}
            style={{ marginBottom: "16px", ...cardStyle }}
            title={
              <div style={{ textAlign: "center" }}>
                <Title level={4}>{discussion.title}</Title>
                <span>{discussion.date}</span>
              </div>
            }
          >
            <p>{discussion.description}</p>
          </Card>
        ))}
      </Sider>
    </Layout>
  );
};

export default StudentDashboard;
