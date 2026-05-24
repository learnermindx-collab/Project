import React, { useState, useEffect } from "react";
import { Layout, Card, Col, Row, List, Typography, Form, Input, Select, Button, message, Modal } from "antd";
import {
  SmileOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import api from "../../api.js";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

const socket = io("http://localhost:5000");

const getGreetingMessage = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) return "Good Morning";
  if (currentHour < 18) return "Good Afternoon";
  return "Good Evening";
};

const cardStyle = {
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  fontSize: "16px",
};

const iconStyle = {
  paddingTop: "1rem",
  fontSize: "2rem",
  marginBottom: "0.5rem",
};

const StudentDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [events, setEvents] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const navigate = useNavigate();

  // FIXED: Removed redundant /auth/me check (caused instant logout) - $(date +%Y-%m-%d %H:%M)
  // Global api.js 401 interceptor handles auth failures


  useEffect(() => {
    fetchTasks();
    fetchMeetings();
    fetchEvents();
    fetchDiscussions();

    const userId = localStorage.getItem('userId');
    if (userId) {
      socket.emit('join', userId);
    }

    socket.on('projectUpdate', fetchTasks);
    socket.on('meetingUpdate', fetchMeetings);
    socket.on('discussionUpdate', fetchDiscussions);

    return () => {
      socket.off('projectUpdate', fetchTasks);
      socket.off('meetingUpdate', fetchMeetings);
      socket.off('discussionUpdate', fetchDiscussions);
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/projects/my');
      setTasks([response.data || null]);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    }
  };

  const fetchMeetings = async () => {
    try {
      const response = await api.get('/meetings/student');
      setMeetings(response.data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchDiscussions = async () => {
    try {
      const response = await api.get('/discussions/user');
      setDiscussions(response.data);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    }
  };

  const handleIssueSubmit = async (values) => {
    try {
      await api.post('/issues', values);
      message.success('Issue submitted successfully!');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to submit issue');
    }
  };

  return (
    <Content style={{ padding: "clamp(1rem, 5vw, 2rem)" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={18}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Card
                title={
                  <div style={{ textAlign: "center" }}>
                    <SmileOutlined style={{ ...iconStyle, color: "#1890ff" }} />
                    <Title level={4}>{getGreetingMessage()}</Title>
                  </div>
                }
                style={cardStyle}
              >
                <p>Welcome back! Keep up the great work.</p>
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card
                title={
                  <div style={{ textAlign: "center" }}>
                    <CheckCircleOutlined
                      style={{ ...iconStyle, color: "#1890ff" }}
                    />
                    <Title level={4}>Assigned Projects</Title>
                  </div>
                }
                style={cardStyle}
              >
                <p>You have {tasks.length} projects assigned.</p>
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card
                title={
                  <div style={{ textAlign: "center" }}>
                    <ClockCircleOutlined
                      style={{ ...iconStyle, color: "#1890ff" }}
                    />
                    <Title level={4}>Upcoming Meetings</Title>
                  </div>
                }
                style={cardStyle}
              >
                <List
                  dataSource={meetings.slice(0, 5).map(m => m.title)}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card
                title={
                  <div style={{ textAlign: "center" }}>
                    <CalendarOutlined
                      style={{ ...iconStyle, color: "#1890ff" }}
                    />
                    <Title level={4}>Upcoming Events</Title>
                  </div>
                }
                style={cardStyle}
              >
                <List
                  dataSource={events.slice(0, 5).map(e => e.title)}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xs={24} lg={6}>
          <div style={{ 
            height: "fit-content",
            backgroundColor: "#f0f2f5", 
            borderLeft: "1px solid #d9d9d9",
            padding: "clamp(1rem, 2vw, 1.5rem)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <Title level={4} style={{ margin: 0 }}>
                Previous Discussions
              </Title>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} size="small">
                Report Issue
              </Button>
            </div>
            {discussions.map((discussion, index) => (
              <Card
                key={index}
                style={{ marginBottom: "16px", ...cardStyle }}
                title={
                  <div style={{ textAlign: "center" }}>
                    <Title level={4}>{discussion.meeting?.title || 'Discussion'}</Title>
                    <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                  </div>
                }
              >
                <p>{discussion.description}</p>
              </Card>
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
    </Content>
  );
};

export default StudentDashboard;

