import React from "react";
import { Card, Col, Row } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  DatabaseOutlined,
  PieChartOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Meta } = Card;

const cardData = [
  {
    title: "Total Students",
    count: 63,
    icon: <UserOutlined />,
  },
  {
    title: "Total Mentors",
    count: 6,
    icon: <TeamOutlined />,
  },
  {
    title: "Total Groups",
    count: 23,
    icon: <TeamOutlined />,
  },
  {
    title: "Total Projects",
    count: 23,
    icon: <DatabaseOutlined />,
  },
  {
    title: "Progress Projects",
    count: 13,
    icon: <PieChartOutlined />,
  },
  {
    title: "Finished Projects",
    count: 10,
    icon: <CheckCircleOutlined />,
  },
  {
    title: "Upcoming Meetings",
    count: 5,
    icon: <CalendarOutlined />,
    description: "Important Discussion  23, August 2024",
  },
  {
    title: "Events Within One Week",
    count: 3,
    icon: <ClockCircleOutlined />,
    description: "Mentorship Meeting, Final Project Discussion",
  },
];

const previousDiscussions = [
  {
    title: "Guidance on Research Methodology",
    description:
      "Detailed discussion about Guidance on Research Methodolgy",
    date: "2024-08-01",
  },
  {
    title: "Mentor Assignment Clarification",
    description: "Clarifications regarding mentor assignment and guidance.",
    date: "2024-08-02",
  },
  {
    title: "FYP Documentation Review",
    description: "Discussion on reviewing the FYP documentation submitted.",
    date: "2024-08-03",
  },
 
];

const CardGrid = () => {
  return (
    <Row gutter={16} style={{ padding: "30px" }}>
      <Col span={16}>
        <Row gutter={16}>
          {cardData.slice(0, 6).map((data, index) => (
            <Col span={8} key={index}>
              <Card hoverable className="card">
                <div className="card-content">
                  <div className="card-icon">{data.icon}</div>
                  <Meta
                    title={data.title}
                    description={`${data.count} ${data.title.toLowerCase()}`}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        <Row gutter={16} style={{ marginTop: "24px" }}>
          {cardData.slice(6).map((data, index) => (
            <Col span={12} key={index}>
              <Card hoverable className="card">
                <div className="card-content">
                  <div className="card-icon">{data.icon}</div>
                  <Meta
                    title={data.title}
                    description={data.description} 
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Col>

      {/* Right part for discussions */}
      <Col span={8}>
        <div
          style={{
            padding: "20px",
            height: "auto", 
            backgroundColor: "#f0f2f5",
            borderLeft: "1px solid #d9d9d9",
            overflow: "hidden", 
          }}
        >
          <h1
            style={{
              marginBottom: "20px",
              fontSize: "25px",
            }}
          >
            Previous Discussions
          </h1>
          {previousDiscussions.map((discussion, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "white",
                padding: "15px",
                marginBottom: "16px",
                borderRadius: "8px",
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", 
              }}
            >
              <h3 style={{ margin: 0, fontSize: "16px", whiteSpace: "normal" }}>
                {discussion.title}
              </h3>
              <p style={{ margin: "10px 0" }}>{discussion.description}</p>
              <span>Date: {discussion.date}</span>
            </div>
          ))}
        </div>
      </Col>
    </Row>
  );
};

export default CardGrid;
