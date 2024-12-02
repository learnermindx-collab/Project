import React, { useState } from "react";
import { Button, Card, Row, Col, Modal, Form, Input, notification } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const projects = [
  {
    id: 1,
    name: "Communication Era",
    groupMembers: ["Alina", "Bushra", "Charlis"],
    intro:
      "To explore and analyze the evolution of communication technologies and their impact on society.",
    imageUrl: "/img8.jpg",
  },
  {
    id: 2,
    name: "Development",
    groupMembers: ["Daoud", "Elina", "Fareeha"],
    intro:
      "To study the impact of technological advancements on development processes and outcomes.",
    imageUrl: "/img4.webp",
  },
  {
    id: 3,
    name: "Cost Management",
    groupMembers: ["Gulzar", "Heider", "Iram"],
    intro:
      "To develop strategies for effectively planning, controlling, and reducing project or operational costs.",
    imageUrl: "/img5.jpg",
  },
];

const ProjectReviewPage = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isMeetingModalVisible, setIsMeetingModalVisible] = useState(false);
  const [meetingDate, setMeetingDate] = useState(null);

  const handleScheduleMeeting = (project) => {
    setSelectedProject(project);
    setIsMeetingModalVisible(true);
  };

  const handleMeetingSubmit = () => {
    const date = meetingDate ? meetingDate.toLocaleString() : "not specified";
    notification.success({
      message: "Meeting Scheduled",
      description: `A meeting has been scheduled with the group members of "${selectedProject?.name}" on ${date}. The student has been notified.`,
    });
    setMeetingDate(null);
    setIsMeetingModalVisible(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          paddingTop: "1px",
          paddingBottom: "1px",
          textAlign: "left",
          fontSize: "30px",
        }}
      >
        <h2
          style={{
            backgroundColor: "#4D96FF",
            paddingBottom: "10px",
            textAlign: "center",
            color:"white",
          }}
        >
          Student's Meeting Schedule
        </h2>
      </div>
      <Row gutter={16}>
        {projects.map((project) => (
          <Col span={8} key={project.id}>
            <Card
              title={project.name}
              cover={
                <img
                  alt={project.name}
                  src={project.imageUrl}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              }
            >
              <p>
                <strong>Group Members:</strong> {project.groupMembers.join(", ")}
              </p>
              <p>{project.intro}</p>
              <Button
                type="primary"
                style={{ marginTop: "10px" }}
                onClick={() => handleScheduleMeeting(project)}
              >
                Schedule Meeting
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={`Schedule Meeting for ${selectedProject?.name}`}
        visible={isMeetingModalVisible}
        onCancel={() => setIsMeetingModalVisible(false)}
        footer={[
          <Button key="submit" type="primary" onClick={handleMeetingSubmit}>
            Schedule Meeting
          </Button>,
        ]}
      >
        <Form layout="vertical" requiredMark={false}>
          <Form.Item label="Select Date and Time" required>
            <DatePicker
              selected={meetingDate}
              onChange={(date) => setMeetingDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="Pp"
              placeholderText="Select date and time"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item label="Meeting Purpose (Optional)">
            <Input.TextArea
              placeholder="Describe the purpose of the meeting..."
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectReviewPage;
