import React, { useState } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  message,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Meta } = Card;
const { Option } = Select;

const mentorsList = ["Dr. Smith", "Prof. Brown", "Ms. Green"];

const ProjectCard = ({ project, onEdit, onViewProposal }) => (
  <Card
    hoverable
    style={{
      borderRadius: "8px",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      margin: "10px",
    }}
    cover={
      <img
        alt={project.name}
        src={project.image}
        style={{
          height: "180px",
          objectFit: "cover",
          borderRadius: "8px 8px 0 0",
        }}
      />
    }
    actions={[
      <Button type="primary" onClick={() => onEdit(project)}>
        Edit Details
      </Button>,
      <Button type="default" onClick={() => onViewProposal(project)}>
        View Proposal
      </Button>,
    ]}
  >
    <Meta
      title={project.name}
      description={
        <div>
          <Row justify="space-between">
            <Col>
              <strong>Status:</strong> {project.status}
            </Col>
            <Col>
              <strong>Members:</strong> {project.membersCount}
            </Col>
          </Row>
          <Row justify="space-between" style={{ marginTop: "5px" }}>
            <Col>
              <strong>Leader:</strong> {project.leader}
            </Col>
            <Col>
              <strong>Supervisors:</strong> {project.mentor}
            </Col>
          </Row>
        </div>
      }
    />
  </Card>
);

const FYPProjects = () => {
  const [projects, setProjects] = useState([
    // Sample projects (12)
    {
      id: 1,
      name: "Learn Thinking",
      status: "In Progress",
      membersCount: 5,
      leader: "Alice",
      mentor: "Dr. Smith",
      image: "/img11.jpg",
      proposal: "Proposal document content for Project A",
    },
    {
      id: 2,
      name: "PrintEase",
      status: "Completed",
      membersCount: 3,
      leader: "Bob",
      mentor: "Prof. Brown",
      image: "/PrintEase.jpg",
      proposal: "Proposal document content for Project B",
    },
    {
      id: 3,
      name: "PI Project",
      status: "In Progress",
      membersCount: 4,
      leader: "Charlie",
      mentor: "Ms. Green",
      image: "/img3.webp",
      proposal: "Proposal document content for Project C",
    },
    {
      id: 4,
      name: "Cost Management",
      status: "In Progress",
      membersCount: 6,
      leader: "Diana",
      mentor: "Dr. Smith",
      image: "/img5.jpg",
      proposal: "Proposal document content for Project D",
    },
    {
      id: 5,
      name: "Development",
      status: "Completed",
      membersCount: 2,
      leader: "Eve",
      mentor: "Prof. Brown",
      image: "/img4.webp",
      proposal: "Proposal document content for Project E",
    },
    {
      id: 6,
      name: "24/7 Jobs",
      status: "In Progress",
      membersCount: 3,
      leader: "Frank",
      mentor: "Ms. Green",
      image: "/img6.jpg",
      proposal: "Proposal document content for Project F",
    },
    {
      id: 7,
      name: "Initial Public Offering (IPO)",
      status: "Completed",
      membersCount: 5,
      leader: "Grace",
      mentor: "Dr. Smith",
      image: "/img7.jpg",
      proposal: "Proposal document content for Project G",
    },
    {
      id: 8,
      name: "Petpedia",
      status: "In Progress",
      membersCount: 4,
      leader: "Hank",
      mentor: "Prof. Brown",
      image: "/Petpedia.jpg",
      proposal: "Proposal document content for Project H",
    },
    {
      id: 9,
      name: "Smart Home Automation (SHA)",
      status: "Completed",
      membersCount: 2,
      leader: "Ivy",
      mentor: "Ms. Green",
      image: "/SHA.jpg",
      proposal: "Proposal document content for Smart Home Automation (SHA)",
    },
    {
      id: 10,
      name: "Communication Era",
      status: "In Progress",
      membersCount: 3,
      leader: "Jack",
      mentor: "Dr. Smith",
      image: "/img8.jpg",
      proposal: "Proposal document content for Project J",
    },
    {
      id: 11,
      name: "Collabora",
      status: "Completed",
      membersCount: 5,
      leader: "Karen",
      mentor: "Prof. Brown",
      image: "/COLABORA.png",
      proposal: "Proposal document content for Project K",
    },
    {
      id: 12,
      name: "Unit Nation",
      status: "In Progress",
      membersCount: 4,
      leader: "Leo",
      mentor: "Ms. Green",
      image: "/img1.webp",
      proposal: "Proposal document content for Project L",
    },
  ]);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isProposalModalVisible, setIsProposalModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProposal, setViewingProposal] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const showEditModal = (project) => {
    setEditingProject(project);
    setUploadedImage(project.image);
    setIsEditModalVisible(true);
  };

  const showProposalModal = (project) => {
    setViewingProposal(project);
    setIsProposalModalVisible(true);
  };

  const handleEditSubmit = (values) => {
    const updatedProject = {
      ...values,
      image: uploadedImage || editingProject.image,
    };

    setProjects((prevProjects) =>
      prevProjects.map((proj) =>
        proj.id === editingProject.id ? { ...proj, ...updatedProject } : proj
      )
    );

    message.success(`Mentor updated successfully for ${values.name}.`);

    setIsEditModalVisible(false);
    setEditingProject(null);
  };

  const handleProposalSubmit = (status, feedback) => {
    message.success(`Proposal ${status}.`);
    setIsProposalModalVisible(false);
    setViewingProposal(null);
  };

  const handleCancelEditModal = () => {
    setIsEditModalVisible(false);
    setEditingProject(null);
  };

  const handleCancelProposalModal = () => {
    setIsProposalModalVisible(false);
    setViewingProposal(null);
  };

  const handleImageUpload = ({ file }) => {
    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: "0px" }}>
      <h1
        style={{
          textAlign: "center",
          marginTop: "0px",
          paddingBottom:"15px",
          paddingTop:"15px",
          marginBottom: "30px",
          backgroundColor: "#4D96FF",
          color: "white",
        }}
      >
        Projects
      </h1>
      <Row gutter={[16, 16]} justify="center">
        {projects.map((project) => (
          <Col span={8} key={project.id}>
            <ProjectCard
              project={project}
              onEdit={showEditModal}
              onViewProposal={showProposalModal}
            />
          </Col>
        ))}
      </Row>

      {/* Edit Modal */}
      <Modal
        title="Edit Project Details"
        visible={isEditModalVisible}
        onCancel={handleCancelEditModal}
        footer={null}
      >
        {editingProject && (
          <Form
            layout="vertical"
            initialValues={editingProject}
            onFinish={handleEditSubmit}
          >
            <Form.Item name="name" label="Project Name">
              <Input />
            </Form.Item>
            <Form.Item name="status" label="Status">
              <Input />
            </Form.Item>
            <Form.Item name="membersCount" label="Members Count">
              <Input type="number" />
            </Form.Item>
            <Form.Item name="leader" label="Leader">
              <Input />
            </Form.Item>
            <Form.Item name="mentor" label="Mentor">
              <Select>
                {mentorsList.map((mentor) => (
                  <Option key={mentor} value={mentor}>
                    {mentor}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Project Image">
              <Upload
                beforeUpload={() => false}
                onChange={handleImageUpload}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
              {uploadedImage && (
                <img
                  src={uploadedImage}
                  alt="Project Preview"
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    borderRadius: "8px",
                  }}
                />
              )}
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Save Changes
            </Button>
          </Form>
        )}
      </Modal>

      {/* Proposal Modal */}
      <Modal
        title="Project Proposal"
        visible={isProposalModalVisible}
        onCancel={handleCancelProposalModal}
        footer={null}
      >
        
        {viewingProposal && (
          <div>
            
            <p>{viewingProposal.proposal}</p>
            <Button
              type="primary"
              onClick={() => handleProposalSubmit("Accepted")}
              style={{ marginRight: "10px" }}
            >
              Accept
            </Button>
            <Button
              type="default"
              onClick={() => handleProposalSubmit("Rejected")}
            >
              Reject
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FYPProjects;
