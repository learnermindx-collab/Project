import { BellFilled, UserAddOutlined } from "@ant-design/icons";
import { Avatar, Badge, Image, List, Space, Typography, Dropdown, Button } from "antd";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import notify from "../utils/notify";

function AppHeader() {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [userName, setUserName] = useState("User");
  const socketRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Load user name from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name || 'User');
      } catch (e) {
        console.error('Failed to parse user:', e);
      }
    }

    // Initialize socket connection
    socketRef.current = io('http://localhost:5000');

    // Join user room
    let userId = localStorage.getItem('userId');
    const userStrForId = localStorage.getItem('user');
    if (userStrForId) {
      try {
        const user = JSON.parse(userStrForId);
        userId = user._id || userId;
      } catch (e) {
        console.error('Failed to parse user for ID:', e);
      }
    }
    if (userId) {
      socketRef.current.emit('join', userId);
    }

    // Listen for notifications
    socketRef.current.on('notification', (notification) => {
      setNotificationCount(prev => prev + 1);
      setNotifications(prev => [notification, ...prev]);
      notify.success('New Notification', notification.message);

      // Play bell sound
      if (audioRef.current) {
        audioRef.current.play();
      }
    });

    // Fetch initial notifications
    fetchNotifications();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const unreadCount = response.data.filter(n => !n.read).length;
      setNotificationCount(unreadCount);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setNotificationCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setNotificationCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const notificationMenu = (
    <div style={{
      width: 350,
      maxHeight: 400,
      overflowY: 'auto',
      backgroundColor: 'white',
      border: '1px solid #d9d9d9',
      borderRadius: '6px',
      boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #f0f0f0',
        backgroundColor: '#fafafa',
        borderRadius: '6px 6px 0 0'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Notifications</div>
        <Button type="link" onClick={markAllAsRead} style={{ padding: 0, fontSize: '12px' }}>
          Mark all as read
        </Button>
      </div>
      {notifications.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
          No notifications
        </div>
      ) : (
        <List
          dataSource={notifications.slice(0, 10)}
          renderItem={(item) => (
            <List.Item
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0',
                backgroundColor: item.read ? 'white' : '#f6ffed'
              }}
              onClick={() => markAsRead(item._id)}
            >
              <List.Item.Meta
                title={
                  <div>
                    <span style={{ fontWeight: item.read ? 'normal' : 'bold' }}>
                      {item.message}
                    </span>
                    {!item.read && <span style={{ color: '#52c41a', marginLeft: '8px' }} >●</span>}
                  </div>
                }
                description={
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {item.fromUserId?.name || 'System'} • {new Date(item.timestamp).toLocaleString()}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
// OLD: fixed 200x100, NEW: smaller responsive
  return (
    <div className="AppHeader">
      
      <Image width={150} src="Collabora.png" height={60} preview={false}></Image> 
      
      <Typography.Title>Welcome Back {userName}</Typography.Title>

      <Space size={15}>
        <Avatar
          style={{ backgroundColor: "#264BAD" }}
          icon={<UserAddOutlined />}
        ></Avatar>
        <Dropdown overlay={notificationMenu} trigger={['click']} placement="bottomRight">
          <Badge count={notificationCount} style={{ backgroundColor: "#264BAD" }}>
            <BellFilled style={{ fontSize: 24, color: "#264BAD", cursor: 'pointer' }} />
          </Badge>
        </Dropdown>
      </Space>

      {/* Hidden audio element for bell sound */}
      <audio ref={audioRef} src="/bell.mp3" preload="auto" />
    </div>
  );
}
export default AppHeader;

