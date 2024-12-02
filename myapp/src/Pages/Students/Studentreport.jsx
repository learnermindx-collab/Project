import React, { useState } from "react";
import { Layout, Button, Form, Input, List, message, Card, Select } from "antd";

const { Header, Content } = Layout;
const { Option } = Select;

const ReportPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "",
  });
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [errors, setErrors] = useState({});

  // Validate inputs and set errors
  const validateFields = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.severity) newErrors.severity = "Severity level is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSeverityChange = (value) => {
    setFormData((prevData) => ({ ...prevData, severity: value }));
    setErrors((prevErrors) => ({ ...prevErrors, severity: "" }));
  };

  // Submit new report
  const handleSubmit = () => {
    if (!validateFields()) {
      message.error("Please complete all required fields.");
      return;
    }

    const newReport = {
      ...formData,
      date: new Date().toLocaleString(),
    };

    setReports((prevReports) => [...prevReports, newReport]);
    setFormData({ title: "", description: "", severity: "" });
    message.success("Report submitted successfully");
  };

  // Show report details
  const showReportDetails = (report) => {
    setSelectedReport(report);
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
          fontSize:"20px",
          backgroundColor: "#4D96FF",
          padding: "0 60px",
        }}
      >
        <h2><b>Report Submission</b></h2>
        <Button
          type="primary"
          onClick={() =>
            setFormData({ title: "", description: "", severity: "" })
          }
        >
         <b> New Report</b>
        </Button>
      </Header>
      <Content style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        {/* Report Form Card */}
        <Card
          title={
            <span
              style={{ color: "black", fontSize: "25px", fontWeight: "bold", }}
            >
              Submit a New Report
            </span>
          }
          bordered={false}
          style={{
            marginTop: "30px",
            marginBottom: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            width: "800px",
          }}
        >
          <Form layout="vertical">
            <Form.Item
              label="Title"
              validateStatus={errors.title ? "error" : ""}
              help={errors.title}
            >
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter report title"
                style={{ borderRadius: "5px" }}
              />
            </Form.Item>
            <Form.Item
              label="Description"
              validateStatus={errors.description ? "error" : ""}
              help={errors.description}
            >
              <Input.TextArea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter report description"
                rows={4}
                style={{ borderRadius: "5px" }}
              />
            </Form.Item>
            <Form.Item
              label="Severity"
              validateStatus={errors.severity ? "error" : ""}
              help={errors.severity}
            >
              <Select
                value={formData.severity}
                placeholder="Select severity level"
                onChange={handleSeverityChange}
                style={{ borderRadius: "5px" }}
              >
                <Option value="Medium">Medium</Option>
                <Option value="High">High</Option>
              </Select>
            </Form.Item>
            <Button
              type="primary"
              onClick={handleSubmit}
              style={{ width: "100%", marginTop: "10px" }}
            >
              Submit Report
            </Button>
          </Form>
        </Card>

        {/* Previous Reports Card */}
        <Card
          title="Previous Reports"
          bordered={false}
          style={{
            marginTop: "80px",
            width: "107%",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
        >
          <List
            itemLayout="horizontal"
            dataSource={reports}
            renderItem={(report) => (
              <List.Item
                onClick={() => showReportDetails(report)}
                style={{ cursor: "pointer", padding: "10px 0" }}
              >
                <List.Item.Meta
                  title={report.title}
                  description={`${report.date} - Severity: ${report.severity}`}
                />
              </List.Item>
            )}
          />
        </Card>

        {/* Report Details Card */}
        {selectedReport && (
          <Card
            title={`Report Details - ${selectedReport.title}`}
            style={{
              marginTop: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p>
              <strong>Description:</strong> {selectedReport.description}
            </p>
            <p>
              <strong>Severity:</strong> {selectedReport.severity}
            </p>
            <p>
              <strong>Date:</strong> {selectedReport.date}
            </p>
          </Card>
        )}
      </Content>
    </Layout>
  );
};

export default ReportPage;
