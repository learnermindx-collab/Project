import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [resetData, setResetData] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email: values.email }
      );

      if (response.data.challengeCode) {
        setResetData({
          resetToken: response.data.resetToken,
          challengeCode: response.data.challengeCode,
          email: values.email,
        });
        message.success("Challenge code generated!");
      } else {
        message.info(response.data.message || "If account exists, continue.");
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      message.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToResetPassword = () => {
    navigate("/reset-password", { state: resetData });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "4px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <Title level={3} style={{ textAlign: "center", color: "#4D96FF" }}>
          Forgot Password
        </Title>

        {!resetData ? (
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please enter your email!" }]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Generate Code
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <div style={{ textAlign: "center" }}>
            <Text strong>Challenge Code:</Text>
            <pre
              style={{
                background: "#f5f5f5",
                padding: "10px",
                borderRadius: "4px",
                marginBottom: "16px",
              }}
            >
              {resetData.challengeCode}
            </pre>

            <Button type="primary" onClick={goToResetPassword} block>
              Go to Reset Password
            </Button>

            <Text type="secondary" style={{ display: "block", marginTop: "10px" }}>
              Use this code on the Reset Password page to update your password.
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
