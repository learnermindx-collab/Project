import React from "react";
import { Form, Input, Button, Row, Col, Typography, Card } from "antd";
import Footerpage from "../Components/Footerpage";

const { Title, Paragraph } = Typography;

const ContactUs = () => {
  const handleFormSubmit = (values) => {
    console.log("Submitted Data:", values);
    alert("Your message has been sent successfully!");
  };

  return (
    <>
    <div style={styles.container}>
      {/* Contact Form Card */}
      <Card style={styles.card}>
        <Title level={1} style={styles.header}>
          Contact Us
        </Title>
        <Paragraph style={styles.subHeader}>
          Have questions or need assistance? Reach out to us.
        </Paragraph>

        <Form
          layout="vertical"
          requiredMark={false}
          onFinish={handleFormSubmit}
          style={styles.form}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Your Name"
                name="name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input
                  placeholder="Enter your full name"
                  style={styles.input}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Your Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input
                  placeholder="Enter your email address"
                  style={styles.input}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Subject"
            name="subject"
            rules={[{ required: true, message: "Please enter the subject" }]}
          >
            <Input
              placeholder="Enter the subject of your message"
              style={styles.input}
            />
          </Form.Item>
          <Form.Item
            label="Message"
            name="message"
            rules={[{ required: true, message: "Please enter your message" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Type your message here"
              style={styles.textArea}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={styles.submitButton}
            >
              Send Message
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Contact Details Card */}
      <Card style={styles.card}>
        <Title level={3} style={styles.contactTitle}>
          Our Contact Details
        </Title>
        <Paragraph style={styles.contactDetails}>
          <strong>Email:</strong> collabora24@gmail.com
          <br />
          <strong>Phone:</strong> +92 (305) 6082320
          <br />
          <strong>Address:</strong> 123 FYP Avenue, Education City, Knowledge
          Town
        </Paragraph>
      </Card>
    </div>
    <Footerpage />
    </>
  );
};

//  CSS 
const styles = {
  container: {
    padding: "40px 20px",
    maxWidth: "900px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    marginBottom: "30px",
    borderRadius: "10px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    padding: "40px 30px",
    backgroundColor: "#fff",
  },
  header: {
    textAlign: "center",
    marginBottom: "15px",
    fontSize: "36px",
    fontWeight: "600",
    color: "#1890ff",
  },
  subHeader: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "18px",
    color: "#7f8c8d",
  },
  form: {
    marginBottom: "40px",
  },
  input: {
    borderRadius: "8px",
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ddd",
    marginBottom: "15px",
    transition: "border-color 0.3s ease",
  },
  textArea: {
    borderRadius: "8px",
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ddd",
    marginBottom: "15px",
    transition: "border-color 0.3s ease",
  },
  submitButton: {
    width: "100%",
    padding: "12px 20px",
    fontSize: "18px",
    fontWeight: "600",
    backgroundColor: "#3498db",
    borderColor: "#3498db",
    borderRadius: "8px",
    color: "#fff",
    transition: "background-color 0.3s ease",
  },
  contactTitle: {
    fontSize: "26px",
    fontWeight: "500",
    color: "#2c3e50",
    marginBottom: "15px",
  },
  contactDetails: {
    fontSize: "16px",
    color: "#7f8c8d",
  },
};

export default ContactUs;
