import React from 'react';
import { Table, Tag } from 'antd';

const Issues = () => {
  
  const issues = [
    {
      key: '1',
      title: 'Login Issue',
      description: 'Unable to login due to server error.',
      severity: 'High',
      date: '2024-11-20',
      time: '10:45 AM',
    },
    {
      key: '2',
      title: 'Page Not Found',
      description: '404 error on the dashboard.',
      severity: 'Medium',
      date: '2024-11-19',
      time: '02:15 PM',
    },
    {
      key: '3',
      title: 'Slow Performance',
      description: 'Application takes too long to load.',
      severity: 'High',
      date: '2024-11-18',
      time: '09:00 AM',
    },
  ];

  // Table column definitions
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity) => (
        <Tag color={severity === 'High' ? 'red' : 'orange'}>
          {severity}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Issue's </h1>
      <Table
        columns={columns}
        dataSource={issues}
        bordered
        pagination={false}
        style={styles.table}
      />
    </div>
  );
};


const styles = {
  container: {
    marginLeft: '180px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    paddingTop:"20px",
    paddingBottom:"20px",
    backgroundColor:"#1890ff",
    marginBottom: '20px',
    fontSize: '2rem',
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  table: {
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
  },
};

export default Issues;
