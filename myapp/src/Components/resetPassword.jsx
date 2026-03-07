import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const { Title } = Typography;

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const resetData = location.state; // { email, resetToken, challengeCode }

  const [loading, setLoading] = useState(false);

  if (!resetData) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <Title level={4}>No reset data found.</Title>
        <Button onClick={() => navigate("/forgot-password")}>
          Go to Forgot Password
        </Button>
      </div>
    );
  }

  const onFinish = async (values) => {
    setLoading(true);
    if (values.newPassword !== values.confirmPassword) {
      message.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          email: resetData.email,
          resetToken: resetData.resetToken,
          challengeCode: values.challengeCode,
          newPassword: values.newPassword,
        }
      );

      message.success(response.data.message || "Password reset successful!");
      navigate("/login");
    } catch (error) {
      console.error(error.response?.data || error.message);
      message.error(
        error.response?.data?.error || "Reset failed. Try again."
      );
    } finally {
      setLoading(false);
    }
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
          Reset Password
        </Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="challengeCode"
            label="Challenge Code"
            rules={[{ required: true, message: "Enter challenge code!" }]}
          >
            <Input placeholder="Enter challenge code" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[{ required: true, message: "Enter new password!" }]}
          >
            <Input.Password placeholder="New password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            rules={[{ required: true, message: "Confirm new password!" }]}
          >
            <Input.Password placeholder="Confirm password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
