import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  List,
  Spin,
  Tag,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "../../api";
import notify from "../../utils/notify";

const StudentProject = () => {
  const [view, setView] = useState("project");
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    loadMyProject();

    const handleFocus = () => loadMyProject();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const loadMyProject = async () => {
    try {
      const res = await api.get("/projects/my");
      setProject(res.data || null);
    } catch {
      notify.error("Unable to load project");
    } finally {
      setLoading(false);
    }
  };

  const submitProposal = async (values) => {
    const fd = new FormData();
    fd.append("title", values.title);
    fd.append("description", values.description);
    fd.append("objectives", values.objectives);
    fd.append("document", values.document.file);

    try {
      await api.post("/projects", fd);

      notify.success("Proposal submitted");
      setView("project");
      loadMyProject();
    } catch {
      notify.error("Submission failed");
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
      proposal_submitted: "Proposal Submitted - Waiting for Supervisor Assignment",
      under_review: "Under Review by Supervisor",
      supervisor_approved: "Approved by Supervisor - Pending HOD Evaluation",
      approved: "Approved",
      rejected: "Rejected by Supervisor",
      hod_approved: "✓ Fully Approved (HOD & Supervisor)",
      hod_rejected: "Rejected by HOD",
      in_progress: "In Progress",
      completed: "Completed",
    };
    return labels[status] || status;
  };

  const getStatusStep = (status) => {
    const steps = {
      proposal_submitted: 1,
      under_review: 2,
      supervisor_approved: 3,
      hod_approved: 4,
      hod_rejected: -1,
      rejected: -1,
      approved: 4,
      in_progress: 5,
      completed: 6,
    };
    return steps[status] || 0;
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "30px auto" }}>
      {view === "project" && (
        <Card title="My Project">
          {project ? (
            <>
              <p><strong>Title:</strong> {project.title}</p>
              <p><strong>Description:</strong> {project.description}</p>
              <p><strong>Objectives:</strong> {project.objectives}</p>
              
              <div style={{ marginBottom: "15px" }}>
                <strong>Status:</strong> <Tag color={getStatusColor(project.status)} style={{ marginLeft: 8 }}>
                  {getStatusLabel(project.status)}
                </Tag>
              </div>

              {/* Progress Steps */}
              {project.status !== "rejected" && project.status !== "hod_rejected" && (
                <Card size="small" style={{ marginBottom: "15px", backgroundColor: "#f5f5f5" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ textAlign: "center", flex: 1 }}>
                      <div style={{ 
                        width: 30, 
                        height: 30, 
                        borderRadius: "50%", 
                        backgroundColor: getStatusStep(project.status) >= 1 ? "#1890ff" : "#d9d9d9",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto"
                      }}>1</div>
                      <small>Submitted</small>
                    </div>
                    <div style={{ flex: 0.5, height: 2, backgroundColor: getStatusStep(project.status) >= 2 ? "#1890ff" : "#d9d9d9" }}></div>
                    <div style={{ textAlign: "center", flex: 1 }}>
                      <div style={{ 
                        width: 30, 
                        height: 30, 
                        borderRadius: "50%", 
                        backgroundColor: getStatusStep(project.status) >= 2 ? "#1890ff" : "#d9d9d9",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto"
                      }}>2</div>
                      <small>Supervisor<br/>Assigned</small>
                    </div>
                    <div style={{ flex: 0.5, height: 2, backgroundColor: getStatusStep(project.status) >= 3 ? "#1890ff" : "#d9d9d9" }}></div>
                    <div style={{ textAlign: "center", flex: 1 }}>
                      <div style={{ 
                        width: 30, 
                        height: 30, 
                        borderRadius: "50%", 
                        backgroundColor: getStatusStep(project.status) >= 3 ? "#1890ff" : "#d9d9d9",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto"
                      }}>3</div>
                      <small>Supervisor<br/>Approved</small>
                    </div>
                    <div style={{ flex: 0.5, height: 2, backgroundColor: getStatusStep(project.status) >= 4 ? "#1890ff" : "#d9d9d9" }}></div>
                    <div style={{ textAlign: "center", flex: 1 }}>
                      <div style={{ 
                        width: 30, 
                        height: 30, 
                        borderRadius: "50%", 
                        backgroundColor: getStatusStep(project.status) >= 4 ? "#1890ff" : "#d9d9d9",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto"
                      }}>4</div>
                      <small>HOD<br/>Approved</small>
                    </div>
                  </div>
                </Card>
              )}

              {(project.status === "rejected" || project.status === "hod_rejected") && (
                <Card size="small" style={{ marginBottom: "15px", backgroundColor: "#fff1f0" }}>
                  <p style={{ color: "#cf1322", margin: 0 }}>
                    <strong>Note:</strong> Your project proposal has been rejected. Please check the feedback and submit a new proposal if needed.
                  </p>
                </Card>
              )}

              <Button type="primary" onClick={() => setView("proposal")} style={{ marginRight: 10 }}>
                Update Proposal
              </Button>
              <Button onClick={() => setView("feedback")}>View Feedback</Button>
            </>
          ) : (
            <>
              <p>No proposal submitted yet.</p>
              <Button type="primary" onClick={() => setView("proposal")}>
                Submit Proposal
              </Button>
            </>
          )}
        </Card>
      )}

      {view === "proposal" && (
        <Card title="Submit Proposal">
          <Form layout="vertical" onFinish={submitProposal}>
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item name="objectives" label="Objectives" rules={[{ required: true }]}>
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item
              name="document"
              label="Document"
              rules={[{ required: true }]}
              valuePropName="file"
            >
              <Upload beforeUpload={() => false} maxCount={1}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">Submit</Button>
              <Button onClick={() => setView("project")} style={{ marginLeft: 10 }}>Cancel</Button>
            </Form.Item>
          </Form>
        </Card>
      )}

      {view === "feedback" && (
        <Card title="Feedback">
          {project?.feedbacks?.length ? (
            <List
              dataSource={project.feedbacks}
              renderItem={(f, i) => (
                <List.Item key={i}>
                  <div>
                    <p>{f.text}</p>
                    <small>{f.by?.name} - {new Date(f.createdAt).toLocaleString()}</small>
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <p>No feedback yet.</p>
          )}

          {project?.hodFeedback && (
            <>
              <h4>HOD Feedback:</h4>
              <List
                dataSource={[project.hodFeedback]}
                renderItem={(f, i) => (
                  <List.Item key={i}>
                    <div>
                      <p>{f.text}</p>
                      <small>{f.by?.name} - {new Date(f.createdAt).toLocaleString()}</small>
                    </div>
                  </List.Item>
                )}
              />
            </>
          )}

          <Button onClick={() => setView("project")} style={{ marginTop: 10 }}>
            Back
          </Button>
        </Card>
      )}
    </div>
  );
};

export default StudentProject;
