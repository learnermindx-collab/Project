// 
import React, { useState } from "react";
import { Form, Input, Button, Select, Card, message } from "antd";
import api from "../../api.js";


const { Option } = Select;

const AddStudent = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log("Form Values:", values);
    setLoading(true);
    try {
      const response = await api.post("/auth/addstudent", values);
      if (response.data.success) {
        message.success("Added Successfully.");
        localStorage.setItem("token", response.data.token);
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="supervisor-container">
      <Card title="Add Student" className="ant-card-supervisor">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{ role: "student" }}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item name="role" label="Role">
            <Select>
              <Option value="student">student</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" type="primary" loading={loading} block>
              Add Student
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddStudent;
