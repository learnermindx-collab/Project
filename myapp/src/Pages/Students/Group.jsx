import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Avatar, Upload, Button, message, Spin } from 'antd';
import { UserOutlined, UploadOutlined, TeamOutlined } from '@ant-design/icons';
import axios from '../../api.js';
import StudentSideBar from './StudentSideBar';
import AppHeader from '../../Components/AppHeader';
import Footerpage from '../../Components/Footerpage';

const { Meta } = Card;

function Group() {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchGroup();
  }, []);

  const fetchGroup = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/projects/mygroup');
      setGroup(response.data);
    } catch (error) {
      console.error('Error fetching group:', error);
      message.warning('No group available yet. Submit and get project approved by supervisor.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async ({ file }) => {
    if (!group) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('logo', file);

    try {
      const response = await axios.post(`/api/projects/group/${group._id}/upload-logo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setGroup(response.data.group);
      message.success('Logo uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="App">
        <AppHeader />
        <div className="SideMenuAndPageContent">
          <StudentSideBar />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spin size="large" />
          </div>
        </div>
        <Footerpage />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="App">
        <AppHeader />
        <div className="SideMenuAndPageContent">
          <StudentSideBar />
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <TeamOutlined style={{ fontSize: '64px', color: '#bfbfbf', marginBottom: '20px' }} />
            <h2>No Group Yet</h2>
            <p>Submit your project and wait for supervisor approval to create a group.</p>
          </div>
        </div>
        <Footerpage />
      </div>
    );
  }

  return (
    <div className="App">
      <AppHeader />
      <div className="SideMenuAndPageContent">
        <StudentSideBar />
        <div style={{ padding: '30px' }}>
          <Row gutter={24}>
            <Col span={8}>
              <Card
                hoverable
                cover={
                  group.logo ? (
                    <img alt="Group Logo" src={`http://localhost:5000/${group.logo}`} style={{ height: 250, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ height: 250, background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <UploadOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                    </div>
                  )
                }
              >
                <Meta 
                  title={group.name} 
                  description={group.description} 
                />
                <Upload
                  name="logo"
                  listType="picture"
                  showUploadList={false}
                  customRequest={handleLogoUpload}
                  accept="image/*"
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />} loading={uploading}>
                    Upload Logo
                  </Button>
                </Upload>
              </Card>
            </Col>
            <Col span={16}>
              <Card title="Team Members">
                <Row gutter={16}>
                  {group.membersInfo.map((member, index) => (
                    <Col span={8} key={index}>
                      <Card hoverable>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar icon={<UserOutlined />} size={48} />
                          <div style={{ marginLeft: 16 }}>
                            <h3>{member.name}</h3>
                            <p>{member.email}</p>
                            <small>ID: {member.id}</small>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      <Footerpage />
    </div>
  );
}

export default Group;

