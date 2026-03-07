import React, { useState, useEffect, useRef } from "react";
import { 
  Layout, Card, Input, Button, Avatar, Typography, message, 
  Modal, Upload, Spin, Empty, Popconfirm, Divider, Tag, Badge, Drawer
} from "antd";
import { 
  LikeOutlined, LikeFilled, MessageOutlined, SendOutlined, 
  PaperClipOutlined, DeleteOutlined, EditOutlined, UserOutlined,
  StarOutlined, StarFilled, BellOutlined, CloseOutlined
} from "@ant-design/icons";
import io from "socket.io-client";
import api from "../api";

const { Content } = Layout;
const { TextArea } = Input;
const { Text, Title } = Typography;

const socket = io("http://localhost:5000");

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const fileInputRef = useRef(null);
  const postsEndRef = useRef(null);

  // Comment state
  const [commentingPostId, setCommentingPostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem('userId');
    const roleFromStorage = localStorage.getItem('role');
    const nameFromStorage = localStorage.getItem('name');
    setUserId(userIdFromStorage);
    setRole(roleFromStorage);
    setUserName(nameFromStorage);

    fetchPosts();
    fetchUnreadCount();

    if (userIdFromStorage) {
      socket.emit('join', userIdFromStorage);
    }

    socket.on('new-message', (newPost) => {
      setPosts(prev => [newPost, ...prev]);
      if (newPost.author._id !== userIdFromStorage) {
        setUnreadCount(prev => prev + 1);
      }
    });

    socket.on('update-likes', ({ messageId, likes }) => {
      setPosts(prev => prev.map(post => 
        post._id === messageId ? { ...post, likes } : post
      ));
    });

    socket.on('delete-message', (messageId) => {
      setPosts(prev => prev.filter(post => post._id !== messageId));
    });

    socket.on('new-comment', ({ messageId, comment, commentCount }) => {
      setPosts(prev => prev.map(post => {
        if (post._id === messageId) {
          return { 
            ...post, 
            comments: [...(post.comments || []), comment],
            commentCount 
          };
        }
        return post;
      }));
    });

    socket.on('delete-comment', ({ messageId, commentId, commentCount }) => {
      setPosts(prev => prev.map(post => {
        if (post._id === messageId) {
          return {
            ...post,
            comments: post.comments?.filter(c => c._id !== commentId) || [],
            commentCount
          };
        }
        return post;
      }));
    });

    socket.on('community-notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket.off('new-message');
      socket.off('update-likes');
      socket.off('delete-message');
      socket.off('new-comment');
      socket.off('delete-comment');
      socket.off('community-notification');
    };
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/community");
      setPosts(response.data.messages);
    } catch (error) {
      console.error("Error fetching posts:", error);
      message.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get("/community/unread-count");
      setUnreadCount(response.data.totalUnread);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const markAsSeen = async () => {
    try {
      await api.post("/community/mark-seen");
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking as seen:", error);
    }
  };

  const handlePost = async () => {
    if (!content.trim() && attachments.length === 0) {
      message.warning("Please add some content or attach a file");
      return;
    }

    try {
      setPosting(true);
      const formData = new FormData();
      formData.append("content", content);
      
      if (attachments.length > 0) {
        attachments.forEach(file => {
          formData.append("attachments", file);
        });
      }

      await api.post("/community", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      message.success("Post created successfully!");
      setContent("");
      setAttachments([]);
      setIsModalVisible(false);
      setEditingPost(null);
    } catch (error) {
      console.error("Error creating post:", error);
      message.error("Failed to create post");
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await api.post(`/community/${postId}/like`);
      setPosts(prev => prev.map(post => 
        post._id === postId ? { ...post, likes: response.data.likes } : post
      ));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/community/${postId}`);
      message.success("Post deleted");
    } catch (error) {
      console.error("Error deleting post:", error);
      message.error("Failed to delete post");
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setContent(post.content);
    setIsModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!content.trim()) {
      message.warning("Please add some content");
      return;
    }

    try {
      setPosting(true);
      const response = await api.put(`/community/${editingPost._id}`, { content });
      setPosts(prev => prev.map(post => 
        post._id === editingPost._id ? response.data : post
      ));
      message.success("Post updated!");
      setContent("");
      setAttachments([]);
      setIsModalVisible(false);
      setEditingPost(null);
    } catch (error) {
      console.error("Error updating post:", error);
      message.error("Failed to update post");
    } finally {
      setPosting(false);
    }
  };

  const handleSubmitComment = async (postId) => {
    if (!commentText.trim()) {
      message.warning("Please enter a comment");
      return;
    }

    try {
      setSubmittingComment(true);
      const response = await api.post(`/community/${postId}/comment`, {
        content: commentText
      });
      setPosts(prev => prev.map(post => 
        post._id === postId ? response.data : post
      ));
      setCommentText("");
      setCommentingPostId(null);
      message.success("Comment added!");
    } catch (error) {
      console.error("Error adding comment:", error);
      message.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const response = await api.delete(`/community/${postId}/comment/${commentId}`);
      setPosts(prev => prev.map(post => 
        post._id === postId ? response.data : post
      ));
      message.success("Comment deleted");
    } catch (error) {
      console.error("Error deleting comment:", error);
      message.error("Failed to delete comment");
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      message.warning("Maximum 5 files allowed");
      return;
    }
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'hod': return 'gold';
      case 'supervisor': return 'blue';
      case 'student': return 'green';
      default: return 'default';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const renderAttachment = (attachment, index) => {
    const isImage = attachment.type === 'image';
    const isVideo = attachment.type === 'video';
    const fileUrl = `http://localhost:5000${attachment.url}`;

    return (
      <div key={index} style={{ marginTop: 8 }}>
        {isImage ? (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            <img 
              src={fileUrl} 
              alt={attachment.originalName}
              style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8, cursor: 'pointer' }}
            />
          </a>
        ) : isVideo ? (
          <video 
            controls 
            src={fileUrl} 
            style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
          />
        ) : (
          <a 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '12px', 
              background: '#f5f5f5', 
              borderRadius: 8,
              gap: 8
            }}
          >
            <PaperClipOutlined style={{ fontSize: 20 }} />
            <span>{attachment.originalName}</span>
          </a>
        )}
      </div>
    );
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <Layout style={{ padding: "24px", minHeight: "100vh", background: "#f0f2f5" }}>
      <Content style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Header with Notification Badge */}
        <div style={{ textAlign: "center", marginBottom: 24, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
          <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
            <StarFilled style={{ color: "#faad14", marginRight: 8 }} />
            CollaHub
            <StarFilled style={{ color: "#faad14", marginLeft: 8 }} />
          </Title>
          <Badge count={unreadCount} onClick={() => { setShowNotifications(true); markAsSeen(); }}>
            <Button 
              type="text" 
              icon={<BellOutlined style={{ fontSize: 24 }} />}
              style={{ marginLeft: 8 }}
            />
          </Badge>
        </div>
        <Text type="secondary" style={{ display: "block", textAlign: "center", marginBottom: 16 }}>
          Share updates, documents, and connect with your team
        </Text>

        {/* Create Post Card */}
        <Card style={{ marginBottom: 16, borderRadius: 12 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <Avatar 
              size={40} 
              icon={<UserOutlined />} 
              style={{ backgroundColor: "#1890ff" }}
            />
            <div style={{ flex: 1 }}>
              <TextArea
                placeholder="What's on your mind? Share updates, ask questions, or post announcements..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                autoSize={{ minRows: 2, maxRows: 6 }}
                style={{ borderRadius: 8, marginBottom: 12 }}
              />
              {attachments.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  {attachments.map((file, index) => (
                    <Tag 
                      key={index} 
                      closable 
                      onClose={() => removeAttachment(index)}
                      style={{ marginBottom: 4 }}
                    >
                      {file.name} ({formatFileSize(file.size)})
                    </Tag>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <Upload 
                    beforeUpload={() => false}
                    showUploadList={false}
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                    maxCount={5}
                  >
                    <Button icon={<PaperClipOutlined />}>Attach Files</Button>
                  </Upload>
                </div>
                <Button 
                  type="primary" 
                  icon={<SendOutlined />}
                  onClick={() => setIsModalVisible(true)}
                  disabled={!content.trim() && attachments.length === 0}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Posts Feed */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 48 }}>
            <Spin size="large" />
          </div>
        ) : posts.length === 0 ? (
          <Empty 
            description="No posts yet. Be the first to share something!"
            style={{ padding: 48 }}
          />
        ) : (
          posts.map((post) => {
            const isLiked = post.likes?.some(like => 
              typeof like === 'string' ? like === userId : like._id === userId
            );
            const isAuthor = post.author?._id === userId || post.author === userId;
            const isHod = role === 'hod';
            const commentsExpanded = expandedComments[post._id];

            return (
              <Card 
                key={post._id} 
                style={{ marginBottom: 16, borderRadius: 12 }}
                bodyStyle={{ padding: 16 }}
              >
                {/* Post Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <Avatar 
                      size={40} 
                      icon={<UserOutlined />}
                      style={{ 
                        backgroundColor: post.author?.role === 'hod' ? '#faad14' : 
                                        post.author?.role === 'supervisor' ? '#1890ff' : '#52c41a'
                      }}
                    />
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Text strong>{post.author?.name || 'Unknown'}</Text>
                        <Tag color={getRoleColor(post.author?.role)}>
                          {post.author?.role?.toUpperCase() || 'USER'}
                        </Tag>
                        {post.isAnnouncement && (
                          <Tag color="red">📢 Announcement</Tag>
                        )}
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {new Date(post.createdAt).toLocaleString()}
                        {post.updatedAt && post.updatedAt !== post.createdAt && " (edited)"}
                      </Text>
                    </div>
                  </div>
                  {(isAuthor || isHod) && (
                    <div style={{ display: "flex", gap: 8 }}>
                      {isAuthor && (
                        <Button 
                          type="text" 
                          icon={<EditOutlined />} 
                          size="small"
                          onClick={() => handleEdit(post)}
                        />
                      )}
                      <Popconfirm
                        title="Delete this post?"
                        onConfirm={() => handleDelete(post._id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button 
                          type="text" 
                          icon={<DeleteOutlined />} 
                          size="small"
                          danger
                        />
                      </Popconfirm>
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <div style={{ marginBottom: 12, whiteSpace: "pre-wrap" }}>
                  {post.content}
                </div>

                {/* Attachments */}
                {post.attachments && post.attachments.length > 0 && (
                  <div>
                    {post.attachments.map((attachment, index) => renderAttachment(attachment, index))}
                  </div>
                )}

                <Divider style={{ margin: "12px 0" }} />

                {/* Post Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <Button 
                    type="text" 
                    icon={isLiked ? <LikeFilled style={{ color: "#ff4d4f" }} /> : <LikeOutlined />}
                    onClick={() => handleLike(post._id)}
                  >
                    {post.likes?.length || 0} {post.likes?.length === 1 ? 'Like' : 'Likes'}
                  </Button>
                  <Button 
                    type="text" 
                    icon={<MessageOutlined />}
                    onClick={() => toggleComments(post._id)}
                  >
                    {post.commentCount || 0} {post.commentCount === 1 ? 'Comment' : 'Comments'}
                  </Button>
                </div>

                {/* Comments Section */}
                {commentsExpanded && (
                  <div style={{ marginTop: 16, paddingLeft: 16, borderLeft: "3px solid #1890ff" }}>
                    {/* Existing Comments */}
                    {post.comments && post.comments.length > 0 ? (
                      post.comments.map((comment, idx) => {
                        const isCommentAuthor = comment.author?._id === userId || comment.author === userId;
                        return (
                          <div key={comment._id || idx} style={{ marginBottom: 12, padding: "8px", background: "#f5f5f5", borderRadius: 8 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div>
                                <Text strong style={{ fontSize: 13 }}>{comment.author?.name || 'Unknown'}</Text>
                                <Tag color={getRoleColor(comment.author?.role)} style={{ marginLeft: 4 }}>
                                  {comment.author?.role?.[0]?.toUpperCase() || 'U'}
                                </Tag>
                              </div>
                              {(isCommentAuthor || isAuthor || isHod) && (
                                <Button 
                                  type="text" 
                                  size="small" 
                                  icon={<CloseOutlined />}
                                  onClick={() => handleDeleteComment(post._id, comment._id)}
                                />
                              )}
                            </div>
                            <div style={{ marginTop: 4 }}>
                              <Text>{comment.content}</Text>
                            </div>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                              {new Date(comment.createdAt).toLocaleString()}
                            </Text>
                          </div>
                        );
                      })
                    ) : (
                      <Text type="secondary">No comments yet. Be the first to comment!</Text>
                    )}

                    {/* Add Comment Input */}
                    <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                      <Avatar size={24} icon={<UserOutlined />} style={{ backgroundColor: "#1890ff" }} />
                      <Input
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onPressEnter={() => handleSubmitComment(post._id)}
                        style={{ flex: 1 }}
                      />
                      <Button 
                        type="primary" 
                        loading={submittingComment}
                        onClick={() => handleSubmitComment(post._id)}
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
        <div ref={postsEndRef} />
      </Content>

      {/* Create/Edit Modal */}
      <Modal
        title={editingPost ? "Edit Post" : "Create Post"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingPost(null);
          setContent("");
          setAttachments([]);
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setIsModalVisible(false);
            setEditingPost(null);
            setContent("");
            setAttachments([]);
          }}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={posting}
            onClick={editingPost ? handleUpdate : handlePost}
          >
            {editingPost ? "Update" : "Post"}
          </Button>
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <TextArea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoSize={{ minRows: 4, maxRows: 8 }}
          />
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
            style={{ display: 'none' }}
          />
          <Button 
            icon={<PaperClipOutlined />}
            onClick={() => fileInputRef.current?.click()}
          >
            Add Attachments (Max 5)
          </Button>
          {attachments.length > 0 && (
            <div style={{ marginTop: 12 }}>
              {attachments.map((file, index) => (
                <Tag 
                  key={index} 
                  closable 
                  onClose={() => removeAttachment(index)}
                  style={{ marginBottom: 4, display: 'block' }}
                >
                  {file.name}
                </Tag>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Notifications Drawer */}
      <Drawer
        title="Notifications"
        placement="right"
        onClose={() => setShowNotifications(false)}
        open={showNotifications}
        width={320}
      >
        {notifications.length === 0 ? (
          <Empty description="No notifications" />
        ) : (
          notifications.map((notif, index) => (
            <div 
              key={index} 
              style={{ 
                padding: "12px", 
                marginBottom: 8, 
                background: "#f5f5f5", 
                borderRadius: 8,
                borderLeft: "3px solid #1890ff"
              }}
            >
              <Text strong>{notif.message}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {notif.authorName}
              </Text>
            </div>
          ))
        )}
      </Drawer>
    </Layout>
  );
};

export default Community;

