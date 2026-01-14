// 

import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  List,
  message,
  notification,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const StudentProject = () => {
  const [view, setView] = useState("project");
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyProject();
  }, []);

  const loadMyProject = async () => {
    try {
      //const res = await axios.get("/api/projects/my", { withCredentials: true });
      axios.get("/api/projects/my", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});
      setProject(res.data || null);
    } catch {
      message.error("Unable to load project");
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
      //await axios.post("/api/projects", fd, { withCredentials: true });
      axios.post("/api/projects", fd, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

      notification.success({ message: "Proposal submitted" });
      setView("project");
      loadMyProject();
    } catch {
      notification.error({ message: "Submission failed" });
    }
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
        <Card title="Project">
          {project ? (
            <>
              <p><strong>Title:</strong> {project.title}</p>
              <p><strong>Description:</strong> {project.description}</p>
              <p><strong>Objectives:</strong> {project.objectives}</p>
              <p><strong>Status:</strong> {project.status}</p>

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
                    <small>{new Date(f.createdAt).toLocaleString()}</small>
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <p>No feedback yet.</p>
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
