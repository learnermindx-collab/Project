import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  List,
  message,
  notification,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const App = () => {
  const [view, setView] = useState("project"); // Controls which view is shown
  const [feedbacks, setFeedbacks] = useState([
    {
      text: "Great start! Please add more details to the objectives.",
      date: "2024-11-01",
      time: "10:30 AM",
    },
    {
      text: "Ensure you cover all major components in your description.",
      date: "2024-11-02",
      time: "02:45 PM",
    },
    {
      text: "Consider adding a timeline for milestones.",
      date: "2024-11-03",
      time: "09:20 AM",
    },
  ]);

  const handleProposalSubmit = (values) => {
    message.success("Proposal submitted successfully.");
    console.log("Submitted Proposal Data:", values);
    setView("project"); // Return to project display after submission
    notification.info({
      message: "Proposal Submitted",
      description: "Your proposal has been submitted and is pending review.",
    });
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 800,
        margin: "20px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {view === "project" && (
        <Card title="Project Details" bordered={false}>
          <p>
            <strong>Title:</strong> Communication Era
          </p>
          <p>
            <strong>Description:</strong> To explore and analyze the evolution
            of communication technologies and their impact on society. And to
            develop innovative solutions for enhancing modern communication
            methods, making them more efficient and accessible.
          </p>
          <p>
            <strong>Leader:</strong> Samaiya
          </p>
          <p>
            <strong>Status:</strong> Proposal Pending
          </p>
          <Button
            type="primary"
            onClick={() => setView("proposal")}
            style={{ marginRight: 10 }}
          >
            Submit Proposal
          </Button>
          <Button onClick={() => setView("feedback")}>View Feedback</Button>
        </Card>
      )}

      {view === "proposal" && (
        <Card title="Submit Project Proposal" bordered={false}>
          <Form
            layout="vertical"
            requiredMark={false} /* Disable the asterisk for required fields */
            onFinish={handleProposalSubmit}
          >
            <Form.Item
              label="Project Title"
              name="title"
              rules={[{ required: true, message: "Please enter the title" }]}
            >
              <Input placeholder="Enter project title" />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please enter the description" },
              ]}
            >
              <Input.TextArea rows={4} placeholder="Describe your project" />
            </Form.Item>
            <Form.Item
              label="Objectives"
              name="objectives"
              rules={[{ required: true, message: "Please enter objectives" }]}
            >
              <Input.TextArea rows={3} placeholder="Enter project objectives" />
            </Form.Item>
            <Form.Item
              label="Attach Document"
              name="document"
              rules={[{ required: true, message: "Please upload a document" }]}
            >
              <Upload>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{
                  color: "#fff",
                }}
              >
                Submit Proposal
              </Button>
              <Button
                onClick={() => setView("project")}
                style={{ marginLeft: 10 }}
                size="large"
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}

      {view === "feedback" && (
        <Card title="Supervisor Feedback" bordered={false}>
          {feedbacks.length > 0 ? (
            <List
              dataSource={feedbacks}
              renderItem={(item, index) => (
                <List.Item key={index}>
                  <div>
                    <p>
                      <strong>Feedback:</strong> {item.text}
                    </p>
                    <p>
                      <strong>Date:</strong> {item.date}
                    </p>
                    <p>
                      <strong>Time:</strong> {item.time}
                    </p>
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <p>No feedback is available at this time.</p>
          )}
          <Button onClick={() => setView("project")} style={{ marginTop: 10 }}>
            Back to Project
          </Button>
        </Card>
      )}
    </div>
  );
};

export default App;
