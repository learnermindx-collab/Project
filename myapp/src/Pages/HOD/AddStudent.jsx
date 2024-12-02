import React from "react";
import { Form, Input, Button, Select, Upload, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const AddStudent = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Form Values:", values);
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="supervisor-container">
      <Card title="Add Student" className="ant-card-supervisor">
        <Form
          form={form}
          autoComplete="off"
          layout="vertical"
          name="add_supervisor"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          requiredMark={false} 
          initialValues={{
            role: "student",
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input  complete name!" },
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
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select role here!" }]}
          >
            <Select>
              <Option value="student">Student</Option>
            </Select>
          </Form.Item>

          <Form.Item
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
          </Form.Item>

          <Form.Item>
            <Button className="button" type="primary" size="large" block htmlType="submit">
              Add Student
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddStudent;
