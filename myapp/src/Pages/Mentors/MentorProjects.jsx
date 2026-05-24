import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Modal,
  Form,
  Input,
  Spin,
  Tag,
  message,
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import api from "../../api";
import notify from "../../utils/notify";

const ProjectReviewPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [feedback, setFeedback] = useState("");

  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isApproveRejectModalVisible, setIsApproveRejectModalVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    loadProjects();

    const handleFocus = () => loadProjects();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const loadProjects = async () => {
    try {
      const res = await api.get("/projects/supervisor");
      setProjects(res.data || []);
    } catch (err) {
      notify.apiError(err, "Unable to load projects");
    } finally {
      setLoading(false);
    }
  };

  const showViewModal = (project) => {
    setSelectedProject(project);
    setIsViewModalVisible(true);
  };

  const showApproveRejectModal = (project) => {
    setSelectedProject(project);
    setIsApproveRejectModalVisible(true);
  };

  const handleCancel = () => {
    setIsViewModalVisible(false);
    setIsApproveRejectModalVisible(false);
    setSelectedProject(null);
    setFeedback("");
  };

  const handleFeedbackSubmit = async () => {
    try {
      await api.post("/projects/feedback", {
        projectId: selectedProject._id,
        text: feedback,
      });
      notify.success("Feedback submitted");
      loadProjects();
      handleCancel();
    } catch (err) {
      notify.apiError(err, "Failed to submit feedback");
    }
  };

  const handleApprove = async () => {
    try {
      await api.post(`/projects/${selectedProject._id}/approve`);
      notify.success("Project approved - sent to HOD for evaluation");
      loadProjects();
      handleCancel();
    } catch (err) {
      notify.apiError(err, "Failed to approve project");
    }
  };

  const handleReject = async () => {
    try {
      await api.post(`/projects/${selectedProject._id}/reject`);
      notify.success("Project rejected");
      loadProjects();
      handleCancel();
    } catch (err) {
      notify.apiError(err, "Failed to reject project");
    }
  };

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
      supervisor_approved: "Awaiting HOD Evaluation",
      approved: "Approved",
      rejected: "Rejected",
      hod_approved: "HOD Approved",
      hod_rejected: "HOD Rejected",
      in_progress: "In Progress",
      completed: "Completed",
    };
    return labels[status] || status;
  };

  const canApprove = (status) => {
    return status === "under_review";
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Project Reviews</h1>

      <Row gutter={[16, 16]}>
        {projects.map((project) => (
          <Col span={8} key={project._id}>
            <Card
              hoverable
              style={{
                borderRadius: "8px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                margin: "10px",
                width: "320px",
                
              }}
            >
              <Card.Meta
                title={project.title}
                description={
                  <>
                    <p><strong>Leader:</strong> {project.leader?.name || "N/A"}</p>
                    <p><strong>Status:</strong> <Tag color={getStatusColor(project.status)}>{getStatusLabel(project.status)}</Tag></p>
                  </>
                }
              />
              <div style={{ marginTop: "10px" }}>
                <Button
                  type="default"
                  style={{ marginRight: "8px" }}
                  onClick={() => showViewModal(project)}
                >
                  View Details
                </Button>
                {canApprove(project.status) && (
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => showApproveRejectModal(project)}
                  >
                    Approve/Reject
                  </Button>
                )}
                {project.status === "supervisor_approved" && (
                  <Tag color="cyan" style={{ marginTop: "10px" }}>
                    Pending HOD Evaluation
                  </Tag>
                )}
                {project.status === "hod_approved" && (
                  <Tag color="green" style={{ marginTop: "10px" }}>
                    Final Approval by HOD
                  </Tag>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* View Details Modal */}
      <Modal
        title={`Details for ${selectedProject?.title}`}
        open={isViewModalVisible}
        onCancel={handleCancel}
        footer={[
          canApprove(selectedProject?.status) && (
            <Button key="approve" type="primary" onClick={showApproveRejectModal}>
              Approve/Reject
            </Button>
          ),
          <Button key="feedback" type="default" onClick={handleFeedbackSubmit}>
            Submit Feedback
          </Button>,
        ]}
        width={700}
      >
        <h3>Project Details</h3>
        <p>
          <strong>Title:</strong> {selectedProject?.title}
        </p>
        <p>
          <strong>Description:</strong> {selectedProject?.description}
        </p>
        <p>
          <strong>Objectives:</strong> {selectedProject?.objectives}
        </p>
        <p>
          <strong>Leader:</strong> {selectedProject?.leader?.name} ({selectedProject?.leader?.email})
        </p>
        <p>
          <strong>Status:</strong> <Tag color={getStatusColor(selectedProject?.status)}>{getStatusLabel(selectedProject?.status)}</Tag>
        </p>
        <p>
          <strong>Document:</strong>{" "}
          <a
            href={`http://localhost:5000/${selectedProject?.document}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Document
          </a>
        </p>
        <p>
          <strong>Feedbacks:</strong>
        </p>
        <ul>
          {selectedProject?.feedbacks?.map((f, i) => (
            <li key={i}>
              {f.text} - {f.by?.name} ({new Date(f.createdAt).toLocaleString()})
            </li>
          )) || <li>No feedback yet</li>}
        </ul>
        
        {selectedProject?.hodFeedback && (
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
        
        <Form style={{ marginTop: "20px", fontWeight: "bold" }}>
          <Form.Item label="Add Feedback">
            <Input.TextArea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              placeholder="Provide feedback on the project..."
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Approve/Reject Modal */}
      <Modal
        title={`Approve or Reject ${selectedProject?.title}`}
        open={isApproveRejectModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="approve" type="primary" icon={<CheckOutlined />} onClick={handleApprove}>
            Approve (Send to HOD)
          </Button>,
          <Button key="reject" type="danger" icon={<CloseOutlined />} onClick={handleReject}>
            Reject
          </Button>,
        ]}
      >
        <p>Do you want to approve or reject this project?</p>
        <p style={{ color: "#666", fontSize: "12px" }}>
          * If approved, the project will be sent to HOD for final evaluation.
        </p>
      </Modal>
    </div>
  );
};

export default ProjectReviewPage;
