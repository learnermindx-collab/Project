import React, { useState, useEffect } from "react";
import { Card, Col, Row, Form, Input, Select, Button, message, Modal } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  DatabaseOutlined,
  PieChartOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import io from "socket.io-client";

const { Meta } = Card;
const { Option } = Select;

const socket = io("http://localhost:5000");

const CardGrid = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalMentors: 0,
    totalGroups: 0,
    totalProjects: 0,
    progressProjects: 0,
    finishedProjects: 0,
    upcomingMeetings: 0,
    eventsWithinWeek: 0,
  });
  const [discussions, setDiscussions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const cardData = [
    {
      title: "Total Students",
      count: stats.totalStudents,
      icon: <UserOutlined />,
    },
    {
      title: "Total Mentors",
      count: stats.totalMentors,
      icon: <TeamOutlined />,
    },
    {
      title: "Total Groups",
      count: stats.totalGroups,
      icon: <TeamOutlined />,
    },
    {
      title: "Total Projects",
      count: stats.totalProjects,
      icon: <DatabaseOutlined />,
    },
    {
      title: "Progress Projects",
      count: stats.progressProjects,
      icon: <PieChartOutlined />,
    },
    {
      title: "Finished Projects",
      count: stats.finishedProjects,
      icon: <CheckCircleOutlined />,
    },
    {
      title: "Upcoming Meetings",
      count: stats.upcomingMeetings,
      icon: <CalendarOutlined />,
      description: "Important Discussions",
    },
    {
      title: "Events Within One Week",
      count: stats.eventsWithinWeek,
      icon: <ClockCircleOutlined />,
      description: "Mentorship Meetings, Project Discussions",
    },
  ];

  useEffect(() => {
    fetchStats();
    fetchDiscussions();

    // Join socket room
    const userId = localStorage.getItem('userId');
    if (userId) {
      socket.emit('join', userId);
    }

    // Listen for realtime updates
    socket.on('statsUpdate', fetchStats);
    socket.on('discussionUpdate', fetchDiscussions);

    return () => {
      socket.off('statsUpdate', fetchStats);
      socket.off('discussionUpdate', fetchDiscussions);
    };
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/stats/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchDiscussions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/discussions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiscussions(response.data);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    }
  };

  const handleIssueSubmit = async (values) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/issues', values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Issue submitted successfully!');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to submit issue');
    }
  };

  return (
    <>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h1 style={{ fontSize: "25px", margin: 0 }}>Previous Discussions</h1>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                Report Issue
              </Button>
            </div>
            {discussions.map((discussion, index) => (
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
                  {discussion.meeting?.title || 'Discussion'}
                </h3>
                <p style={{ margin: "10px 0" }}>{discussion.description}</p>
                <span>Date: {new Date(discussion.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </Col>
      </Row>

      <Modal
        title="Report Issue"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleIssueSubmit} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter the title' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter the description' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="severity"
            label="Severity"
            rules={[{ required: true, message: 'Please select severity' }]}
          >
            <Select>
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit Issue
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CardGrid;
