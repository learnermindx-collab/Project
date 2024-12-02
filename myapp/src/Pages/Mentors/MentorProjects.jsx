import React, { useState } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Modal,
  Form,
  Input,
  Upload,
  notification,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";


const projects = [
  {
    id: 1,
    name: "Communication Era",
    groupMembers: ["Alina", "Bushra", "Charlis"],
    intro:
      "To explore and analyze the evolution of communication technologies and their impact on society.",
    documentUrl: "https://example.com/project-a-document.pdf",
    proposal: {
      title: "Communication Era Proposal",
      description:
        "This is a detailed description of communication Era Proposal.",
      objective: "For checking.",
    },
    image: "/img8.jpg",
  },
  {
    id: 2,
    name: "Development",
    groupMembers: ["Daoud", "Elina", "Fareeha"],
    intro:
      "To study the impact of technological advancements on development processes and outcomes.",
    documentUrl: "https://example.com/project-b-document.pdf",
    proposal: {
      title: "Development Proposal",
      description:
        "This is a detailed description of the development project Proposal.",
      objective: "For checking.",
    },
    image: "/img4.webp",
  },
  {
    id: 3,
    name: "Cost Management",
    groupMembers: ["Gulzar", "Heina", "Iram"],
    intro:
      "To develop strategies for effectively planning, controlling, and reducing project or operational costs.",
    documentUrl: "https://example.com/project-c-document.pdf",
    proposal: {
      title: "Cost Management Proposal",
      description:
        "This is a detailed description of Cost Management Proposal.",
      objective: "For checking.",
    },
    image: "/img5.jpg",
  },
];

const ProjectReviewPage = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isSendProposalVisible, setIsSendProposalVisible] = useState(false);

  const showViewModal = (project) => {
    setSelectedProject(project);
    setIsViewModalVisible(true);
  };

  const showSendProposalModal = (project) => {
    setSelectedProject(project);
    setIsSendProposalVisible(true);
  };

  const handleCancel = () => {
    setIsViewModalVisible(false);
    setIsSendProposalVisible(false);
    setSelectedProject(null);
    setFeedback("");
    setUploadedFile(null); // Reset uploaded file
  };

  const handleFeedbackSubmit = () => {
    notification.success({
      message: "Feedback Submitted",
      description: `Your feedback for "${selectedProject?.name}" has been submitted successfully.`,
    });
    handleCancel();
  };

  const handleFileUpload = (info) => {
    if (info.file.status === "done") {
      setUploadedFile(info.file);
      notification.success({
        message: "File Uploaded",
        description: `File "${info.file.name}" uploaded successfully.`,
      });
    }
  };

  const handleSendProposal = () => {
    if (!uploadedFile) {
      notification.error({
        message: "No File Uploaded",
        description: "Please upload a file before sending the proposal.",
      });
      return;
    }

    notification.success({
      message: "Proposal Sent",
      description: `The proposal for "${selectedProject?.name}" has been successfully shared with the HOD.`,
    });

    handleCancel();
  };

  return (
    <div style={{ padding: "0px" }}>
      <div
        style={{
          paddingTop: "0px",
          paddingBottom: "0px",
          textAlign: "center",
          fontSize: "30px",
          backgroundColor: "#4D96FF",
          color:"white",
        }}
      >
        <h2>Student Projects</h2>
      </div>
      <Row gutter={16}>
        {projects.map((project) => (
          <Col span={8} key={project.id}>
            <Card
              title={project.name}
              cover={<img alt={project.name} src={project.image} />}
            >
              <p>
                <strong>Group Members:</strong>{" "}
                {project.groupMembers.join(", ")}
              </p>
              <p>{project.intro}</p>
              <Button
                type="primary"
                size="large"
                style={{ marginRight: "25px" }}
                onClick={() => showViewModal(project)}
              >
                View Details
              </Button>
              <Button
                style={{ marginLeft: "20px" }}
                type="default"
                size="large"
                onClick={() => showSendProposalModal(project)}
              >
                Send Proposal
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      {/* View Details Modal */}
      <Modal
        title={` Details for ${selectedProject?.name}`}
        visible={isViewModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" onClick={handleFeedbackSubmit}>
            Submit Feedback
          </Button>,
        ]}
      >
        <h3>Project Details</h3>
        <p>
          <strong>Title:</strong> {selectedProject?.proposal.title}
        </p>
        <p>
          <strong>Objective:</strong> {selectedProject?.proposal.objective}
        </p>
        <p>
          <strong>Document:</strong>{" "}
          <a
            href={selectedProject?.documentUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Document
          </a>
        </p>
        <Form style={{ marginTop: "20px", fontWeight: "bold" }}>
          <Form.Item label="Feedback">
            <Input.TextArea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              placeholder="Provide feedback on the document..."
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Send Proposal Modal */}
      <Modal
        title={`Send Proposal for ${selectedProject?.name}`}
        visible={isSendProposalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="send" type="primary" onClick={handleSendProposal}>
            Send Proposal
          </Button>,
        ]}
      >
        <Form>
          <Form.Item label="Upload File">
            <Upload
              accept=".pdf,.doc,.docx"
              beforeUpload={() => false} // Prevent automatic upload
              onChange={handleFileUpload}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectReviewPage;
