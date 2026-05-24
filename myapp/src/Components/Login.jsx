import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Row,
  Col,
  message,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title, Text, Link } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", values);

      if (response.data.success) {
        const token = response.data.token;
        const role = response.data.role?.toLowerCase?.();

        if (!token || typeof token !== 'string' || token.trim() === '') {
          message.error("Login failed: Invalid token received.");
          return;
        }

        message.success("Successfully Logged In!");

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        // Fetch user profile
        try {
          const profileRes = await axios.get("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (profileRes.data.success) {
            localStorage.setItem("user", JSON.stringify(profileRes.data.user));
          }
        } catch (err) {
          console.error("Failed to fetch profile:", err);
        }

        switch (role) {
          case "hod":
            window.location.href = "/admin";
            break;
          case "student":
            window.location.href = "/student";
            break;
          case "supervisor":
            window.location.href = "/supervisor";
            break;
          default:
             window.location.href = "/"; 
        }
      } else {
         message.error(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      message.error("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: "100vh", background: "#f0f2f5" }}
    >
      <Col lg={8}>
          <div
          style={{
            /* OLD NON-RESPONSIVE: fixed padding */
            /* NEW RESPONSIVE: clamp */
            padding: "clamp(1.5rem, 5vw, 3rem)",
            background: "#fff",
            borderRadius: "2px",
          }}
        >
          <Title level={2} style={{ textAlign: "center", color:"#4D96FF" }}>
            Log In
          </Title>
          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            initialValues={{ remember: true }}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please enter your mail!" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter your password!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Checkbox name="remember" defaultChecked>
                  Remember me
                </Checkbox>
                <Link href="/forgot-password">Forgot Password?</Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Log In
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <Text>Don't have an account? </Text>
            <Link href="/signup">Sign up</Link>
          </div>
        </div>
      </Col>
      <Col lg={8} style={{ textAlign: "center" }}>
        <img
          src="login.png" 
          alt="Login image"
          style={{ /* OLD NON-RESPONSIVE: fixed height */ /* NEW RESPONSIVE: auto height */ width: "100%", height: "auto", maxHeight: "500px", borderRadius: "2px" }}
        />
      </Col>
    </Row>
  );
};
export default Login;

