import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Spin,
  Tag,
  Tabs,
  message,
} from "antd";
import { CheckOutlined, CloseOutlined, EyeOutlined } from "@ant-design/icons";
import api from "../../api";
import notify from "../../utils/notify";

const { Option } = Select;
const { TabPane } = Tabs;

// Project Card Component
const ProjectCard = ({ project, onAssignSupervisor, onViewProposal, onEvaluate }) => {
  const getStatusColor = (status) => {
    const colors = {
      proposal_submitted: "orange",
      under_review: "blue",
      supervisor_approved: "cyan",
      approved: "green",
      rejected: "red",
      hod_approved: "green",
      hod_rejected: "red",
      in_progress: "blue",
      completed: "purple",
    };
    return colors[status] || "default";
  };

  const getStatusLabel = (status) => {
    const labels = {
      proposal_submitted: "Proposal Submitted",
      under_review: "Under Review",
      supervisor_approved: "Supervisor Approved - Pending HOD",
      approved: "Approved",
      rejected: "Rejected",
      hod_approved: "HOD Approved",
      hod_rejected: "HOD Rejected",
      in_progress: "In Progress",
      completed: "Completed",
    };
    return labels[status] || status;
  };

  return (
    <Card
      hoverable
      style={{
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        margin: "10px",
      }}
    >
      <div>
        <Row justify="space-between" align="middle">
          <Col>
            <strong>Title:</strong> {project.title}
          </Col>
          <Col>
            <Tag color={getStatusColor(project.status)}>
              {getStatusLabel(project.status)}
            </Tag>
          </Col>
        </Row>
        <Row justify="space-between" style={{ marginTop: "5px" }}>
          <Col>
            <strong>Leader:</strong> {project.leader?.name || "N/A"}
          </Col>
          <Col>
            <strong>Supervisor:</strong> {project.supervisor?.name || "Not Assigned"}
          </Col>
        </Row>
        <p style={{ marginTop: "10px" }}>{project.description}</p>
        
        <Row justify="end" gutter={8}>
          <Col>
            <Button type="default" icon={<EyeOutlined />} onClick={() => onViewProposal(project)}>
              View Proposal
            </Button>
          </Col>
          {project.status === "proposal_submitted" && (
            <Col>
              <Button type="primary" onClick={() => onAssignSupervisor(project)}>
                Assign Supervisor
              </Button>
            </Col>
          )}
          {project.status === "supervisor_approved" && (
            <Col>
              <Button type="primary" icon={<CheckOutlined />} onClick={() => onEvaluate(project)}>
                Evaluate
              </Button>
            </Col>
          )}
        </Row>
      </div>
    </Card>
  );
};

const FYPProjects = () => {
  const [projects, setProjects] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [isProposalModalVisible, setIsProposalModalVisible] = useState(false);
  const [isEvaluateModalVisible, setIsEvaluateModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    loadProjects();
    loadSupervisors();

    const handleFocus = () => {
      loadProjects();
      loadSupervisors();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const loadProjects = async () => {
    try {
      const res = await api.get("/projects/all");
      setProjects(res.data || []);
    } catch (err) {
      notify.apiError(err, "Unable to load projects");
    } finally {
      setLoading(false);
    }
  };

  const loadSupervisors = async () => {
    try {
      const res = await api.get("/auth/supervisors");
      setSupervisors(res.data || []);
    } catch (err) {
      try {
        const res = await api.get("/stats/supervisors");
        setSupervisors(res.data || []);
      } catch (e) {
        console.error("Unable to load supervisors", e);
      }
    }
  };

  const showAssignModal = (project) => {
    setSelectedProject(project);
    setIsAssignModalVisible(true);
  };

  const showProposalModal = (project) => {
    setSelectedProject(project);
    setIsProposalModalVisible(true);
  };

  const showEvaluateModal = (project) => {
    setSelectedProject(project);
    setIsEvaluateModalVisible(true);
  };

  const handleCancelAssignModal = () => {
    setIsAssignModalVisible(false);
    setSelectedProject(null);
  };

  const handleCancelProposalModal = () => {
    setIsProposalModalVisible(false);
    setSelectedProject(null);
  };

  const handleCancelEvaluateModal = () => {
    setIsEvaluateModalVisible(false);
    setSelectedProject(null);
  };

  const handleAssignSubmit = async (values) => {
    try {
      await api.post("/projects/assign-supervisor", {
        projectId: selectedProject._id,
        supervisorId: values.supervisorId,
      });
      message.success("Supervisor assigned successfully");
      loadProjects();
      handleCancelAssignModal();
    } catch (err) {
      notify.apiError(err, "Failed to assign supervisor");
    }
  };

  const handleEvaluateSubmit = async (values) => {
    try {
      await api.post(`/projects/${selectedProject._id}/evaluate`, {
        decision: values.decision,
        feedback: values.feedback,
      });
      
      if (values.decision === "hod_approved") {
        message.success("Project approved by HOD");
      } else {
        message.info("Project rejected by HOD");
      }
      
      loadProjects();
      handleCancelEvaluateModal();
    } catch (err) {
      notify.apiError(err, "Failed to evaluate project");
    }
  };

  // Filter projects based on active tab
  const getFilteredProjects = () => {
    switch (activeTab) {
      case "pending_hod":
        return projects.filter((p) => p.status === "supervisor_approved");
      case "hod_approved":
        return projects.filter((p) => p.status === "hod_approved");
      case "hod_rejected":
        return projects.filter((p) => p.status === "hod_rejected");
      case "under_review":
        return projects.filter((p) => p.status === "under_review" || p.status === "proposal_submitted");
      default:
        return projects;
    }
  };

  const pendingHodCount = projects.filter((p) => p.status === "supervisor_approved").length;

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>FYP Projects</h1>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="All Projects" key="all">
          <Row gutter={[16, 16]} justify="center">
            {getFilteredProjects().map((project) => (
              <Col span={8} key={project._id}>
                <ProjectCard
                  project={project}
                  onAssignSupervisor={showAssignModal}
                  onViewProposal={showProposalModal}
                  onEvaluate={showEvaluateModal}
                />
              </Col>
            ))}
          </Row>
          {getFilteredProjects().length === 0 && (
            <p style={{ textAlign: "center", color: "#999" }}>No projects found</p>
          )}
        </TabPane>
        
        <TabPane tab={`Pending HOD Evaluation (${pendingHodCount})`} key="pending_hod">
          <Row gutter={[16, 16]} justify="center">
            {getFilteredProjects().map((project) => (
              <Col span={8} key={project._id}>
                <ProjectCard
                  project={project}
                  onAssignSupervisor={showAssignModal}
                  onViewProposal={showProposalModal}
                  onEvaluate={showEvaluateModal}
                />
              </Col>
            ))}
          </Row>
          {getFilteredProjects().length === 0 && (
            <p style={{ textAlign: "center", color: "#999" }}>No projects pending HOD evaluation</p>
          )}
        </TabPane>
        
        <TabPane tab="HOD Approved" key="hod_approved">
          <Row gutter={[16, 16]} justify="center">
            {getFilteredProjects().map((project) => (
              <Col span={8} key={project._id}>
                <ProjectCard
                  project={project}
                  onAssignSupervisor={showAssignModal}
                  onViewProposal={showProposalModal}
                  onEvaluate={showEvaluateModal}
                />
              </Col>
            ))}
          </Row>
        </TabPane>
        
        <TabPane tab="HOD Rejected" key="hod_rejected">
          <Row gutter={[16, 16]} justify="center">
            {getFilteredProjects().map((project) => (
              <Col span={8} key={project._id}>
                <ProjectCard
                  project={project}
                  onAssignSupervisor={showAssignModal}
                  onViewProposal={showProposalModal}
                  onEvaluate={showEvaluateModal}
                />
              </Col>
            ))}
          </Row>
        </TabPane>
      </Tabs>

      {/* Assign Supervisor Modal */}
      <Modal
        title="Assign Supervisor"
        open={isAssignModalVisible}
        onCancel={handleCancelAssignModal}
        footer={null}
      >
        {selectedProject && (
          <Form layout="vertical" onFinish={handleAssignSubmit}>
            <Form.Item name="supervisorId" label="Supervisor" rules={[{ required: true }]}>
              <Select placeholder="Select a supervisor">
                {supervisors.map((sup) => (
                  <Option key={sup._id} value={sup._id}>
                    {sup.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Assign
            </Button>
          </Form>
        )}
      </Modal>

      {/* View Proposal Modal */}
      <Modal
        title="Project Proposal"
        open={isProposalModalVisible}
        onCancel={handleCancelProposalModal}
        footer={null}
        width={700}
      >
        {selectedProject && (
          <div>
            <p>
              <strong>Title:</strong> {selectedProject.title}
            </p>
            <p>
              <strong>Description:</strong> {selectedProject.description}
            </p>
            <p>
              <strong>Objectives:</strong> {selectedProject.objectives}
            </p>
            <p>
              <strong>Leader:</strong> {selectedProject.leader?.name} ({selectedProject.leader?.email})
            </p>
            <p>
              <strong>Supervisor:</strong> {selectedProject.supervisor?.name || "Not Assigned"}
            </p>
            <p>
              <strong>Document:</strong>{" "}
              <a href={`http://localhost:5000/uploads/${selectedProject.document}`} target="_blank" rel="noopener noreferrer">
                View Document
              </a>
            </p>
            <p>
              <strong>Supervisor Feedbacks:</strong>
            </p>
            <ul>
              {selectedProject.feedbacks?.map((f, i) => (
                <li key={i}>
                  {f.text} - {f.by?.name} ({new Date(f.createdAt).toLocaleString()})
                </li>
              )) || <li>No feedback yet</li>}
            </ul>
            {selectedProject.hodFeedback && (
              <>
                <p>
                  <strong>HOD Feedback:</strong>
                </p>
                <ul>
                  <li>
                    {selectedProject.hodFeedback.text} - {selectedProject.hodFeedback.by?.name} ({new Date(selectedProject.hodFeedback.createdAt).toLocaleString()})
                  </li>
                </ul>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Evaluate Modal */}
      <Modal
        title="Evaluate Project"
        open={isEvaluateModalVisible}
        onCancel={handleCancelEvaluateModal}
        footer={null}
      >
        {selectedProject && (
          <Form layout="vertical" onFinish={handleEvaluateSubmit}>
            <p>
              <strong>Project:</strong> {selectedProject.title}
            </p>
            <p>
              <strong>Supervisor:</strong> {selectedProject.supervisor?.name || "Not Assigned"}
            </p>
            
            <Form.Item 
              name="decision" 
              label="Decision" 
              rules={[{ required: true, message: "Please select a decision" }]}
            >
              <Select placeholder="Select decision">
                <Option value="hod_approved">
                  <span style={{ color: "green" }}>
                    <CheckOutlined /> Approve Project
                  </span>
                </Option>
                <Option value="hod_rejected">
                  <span style={{ color: "red" }}>
                    <CloseOutlined /> Reject Project
                  </span>
                </Option>
              </Select>
            </Form.Item>
            
            <Form.Item 
              name="feedback" 
              label="Feedback/Comments"
              rules={[{ required: true, message: "Please provide feedback" }]}
            >
              <Input.TextArea rows={4} placeholder="Provide your evaluation feedback..." />
            </Form.Item>
            
            <Button type="primary" htmlType="submit" block>
              Submit Evaluation
            </Button>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default FYPProjects;
