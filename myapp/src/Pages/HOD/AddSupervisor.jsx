import React from "react";
import { Form, Input, Button, Select, Upload, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {useState} from "react";
import axios from "axios";
import { message } from "antd";
import api from "../../api";
const { Option } = Select;

const AddSupervisor = () => {
 // const [form] = Form.useForm();
const [loading, setLoading] = useState(false);
 const [form] = Form.useForm();
  const onFinish =  async (values) => {
    setLoading(true);
    try{
      // Check if user is logged in
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      
      if (!token) {
        message.error("Please log in first");
        return;
      }
      
      if (role?.toLowerCase() !== "hod") {
        message.error("Only HOD can add supervisors");
        return;
      }

      const response = await api.post( "/auth/addsupervisor", values);

      if (response.data.success || response.status === 201){
        message.success("Added Successfully.");
        form.resetFields();
      }

    }catch (error) {
      setLoading(false);
      if (error.response?.status === 403) {
        message.error("Forbidden: You don't have permission to add supervisors");
      } else if (error.response?.status === 401) {
        message.error("Unauthorized: Please log in again");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      } else {
        message.error(error.response?.data?.message || "Failed to add supervisor");
      }
  }
    // console.log("Form Values:", values);
    // form.resetFields();
   } ;

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="supervisor-container">
      <Card title="Add Supervisor" className="ant-card-supervisor">
        <Form
          form={form}
          autoComplete="off"
          layout="vertical"
          name="add_supervisor"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          requiredMark={false} 
          initialValues={{
            role: "Supervisor",
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input complete name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>
           <Form.Item
            label="password"
            name="password"
            rules={[
              { required: true, message: "Enter password" },
              { type: "password", message: "Please enter a valid password" },
            ]}
          >
            <Input />
          </Form.Item>


          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select role!" }]}
          >
            <Select>
              <Option value="supervisor">supervisor</Option>
            </Select>
          </Form.Item>

          {/* <Form.Item
            label="Profile Picture"
            name="profilePicture"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
            rules={[
              {
                required: true,
                message: "Please upload your profile picture!",
              },
            ]}
          >
            <Upload
              name="profilePic"
              listType="picture"
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item> */}

          <Form.Item>
            <Button type="primary" block htmlType="submit" size="large">
              Add Supervisor
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddSupervisor;
