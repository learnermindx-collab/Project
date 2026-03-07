import React, { useEffect, useState } from "react";
import { Card, Input, Button, List, Avatar, Spin, message, Row, Col, Tag, Tabs } from "antd";
import { GithubOutlined, UserOutlined, StarOutlined, ForkOutlined, EyeOutlined, LockOutlined, KeyOutlined } from "@ant-design/icons";
import api from "../../api";
import notify from "../../utils/notify";

function Github() {
  const [githubUsername, setGithubUsername] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [privateRepositories, setPrivateRepositories] = useState([]);
  const [repoLoading, setRepoLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    loadGithubData();
  }, []);

  const loadGithubData = async () => {
    try {
      const res = await api.get("/github/username");
      setGithubUsername(res.data.githubUsername || "");
      setGithubToken(res.data.githubToken || "");
      if (res.data.githubUsername) {
        loadGithubProfile(res.data.githubUsername, res.data.githubToken);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadGithubProfile = async (username, token) => {
    if (!username) {
      message.warning("Please enter a GitHub username first");
      return;
    }
    setRepoLoading(true);
    try {
      const res = await api.get("/github/profile", {
        headers: token ? { 'x-github-token': token } : {}
      });
      setProfile(res.data.profile);
      setRepositories(res.data.repositories || []);
      setPrivateRepositories(res.data.privateRepositories || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        message.error("GitHub user not found. Please check your username.");
      } else if (err.response?.status === 401) {
        message.error("Invalid GitHub token. Please check your Personal Access Token.");
      } else {
        message.error("Unable to fetch GitHub data");
      }
    } finally {
      setRepoLoading(false);
    }
  };

  const handleSaveUsername = async () => {
    if (!githubUsername.trim()) {
      message.warning("Please enter a GitHub username");
      return;
    }
    setSaving(true);
    try {
      await api.post("/github/username", { 
        githubUsername,
        githubToken: githubToken || undefined 
      });
      message.success("GitHub information saved!");
      loadGithubProfile(githubUsername, githubToken);
    } catch (err) {
      notify.apiError(err, "Failed to save GitHub information");
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = () => {
    if (githubUsername) {
      loadGithubProfile(githubUsername, githubToken);
    }
  };

  const handleRepoClick = (repo) => {
    window.open(repo.html_url, '_blank');
  };

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: "#f1e05a",
      TypeScript: "#2b7489",
      Python: "#3572A5",
      Java: "#b07219",
      "C++": "#f34b7d",
      C: "#555555",
      "C#": "#178600",
      PHP: "#4F5D95",
      Ruby: "#701516",
      Go: "#00ADD8",
      Rust: "#dea584",
      Swift: "#ffac45",
      Kotlin: "#A97BFF",
    };
    return colors[language] || "#858585";
  };

  const getRepoList = () => {
    if (activeTab === "public") return repositories;
    if (activeTab === "private") return privateRepositories;
    return [...repositories, ...privateRepositories];
  };

  const tabItems = [
    {
      key: "all",
      label: `All Repos (${repositories.length + privateRepositories.length})`,
    },
    {
      key: "public",
      label: `Public (${repositories.length})`,
    },
    {
      key: "private",
      label: (
        <span>
          <LockOutlined /> Private ({privateRepositories.length})
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Card title="GitHub Integration" style={{ marginBottom: 20 }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Input
              prefix={<GithubOutlined />}
              placeholder="Enter your GitHub username"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              onPressEnter={handleSaveUsername}
              style={{ marginBottom: 10 }}
            />
            <Input
              prefix={<KeyOutlined />}
              placeholder="GitHub Personal Access Token (for private repos)"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              type="password"
              onPressEnter={handleSaveUsername}
            />
            <p style={{ fontSize: '12px', color: '#666', marginTop: 5, marginBottom: 0 }}>
              Generate token at: GitHub Settings → Developer settings → Personal access tokens
            </p>
            <p style={{ fontSize: '12px', color: '#666', marginTop: 5, marginBottom: 0 }}>
              Required scopes: repo (full control of private repositories)
            </p>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 10 }}>
          <Col>
            <Button type="primary" onClick={handleSaveUsername} loading={saving}>
              Save
            </Button>
          </Col>
          <Col>
            <Button onClick={handleRefresh} disabled={!githubUsername}>
              Refresh
            </Button>
          </Col>
        </Row>
      </Card>

      {repoLoading ? (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Spin size="large" />
        </div>
      ) : profile ? (
        <>
          <Card style={{ marginBottom: 20 }}>
            <Row gutter={20} align="middle">
              <Col>
                <Avatar size={100} src={profile.avatar_url} icon={<UserOutlined />} />
              </Col>
              <Col flex="auto">
                <h2 style={{ margin: 0 }}>{profile.name || profile.login}</h2>
                <p style={{ margin: "5px 0", color: "#666" }}>@{profile.login}</p>
                {profile.bio && <p>{profile.bio}</p>}
                <Row gutter={16}>
                  <Col>
                    <Tag icon={<UserOutlined />} color="blue">
                      {profile.followers} followers
                    </Tag>
                  </Col>
                  <Col>
                    <Tag icon={<UserOutlined />} color="green">
                      {profile.following} following
                    </Tag>
                  </Col>
                  <Col>
                    <Tag icon={<GithubOutlined />} color="purple">
                      {profile.public_repos} repositories
                    </Tag>
                  </Col>
                  {githubToken && (
                    <Col>
                      <Tag icon={<LockOutlined />} color="orange">
                        Private access enabled
                      </Tag>
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
          </Card>

          <Card title="Repositories">
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab} 
              items={tabItems}
              style={{ marginBottom: 16 }}
            />
            <List
              loading={repoLoading}
              grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
              dataSource={getRepoList()}
              renderItem={(repo) => (
                <List.Item>
                  <Card
                    hoverable
                    onClick={() => handleRepoClick(repo)}
                    style={{ cursor: 'pointer' }}
                    title={
                      <span>
                        {repo.private && <LockOutlined style={{ marginRight: 5, color: '#faad14' }} />}
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          {repo.name}
                        </a>
                      </span>
                    }
                    extra={
                      repo.language && (
                        <Tag color={getLanguageColor(repo.language)}>
                          {repo.language}
                        </Tag>
                      )
                    }
                  >
                    <p style={{ minHeight: 40 }}>{repo.description || "No description"}</p>
                    <Row gutter={16}>
                      <Col>
                        <span>
                          <StarOutlined style={{ color: "#e6bf00", marginRight: 4 }} />
                          {repo.stargazers_count}
                        </span>
                      </Col>
                      <Col>
                        <span>
                          <ForkOutlined style={{ marginRight: 4 }} />
                          {repo.forks_count}
                        </span>
                      </Col>
                      <Col>
                        <span>
                          <EyeOutlined style={{ marginRight: 4 }} />
                          {repo.watchers_count}
                        </span>
                      </Col>
                    </Row>
                    <div style={{ marginTop: '10px' }}>
                      <small style={{ color: '#666' }}>Click to open in GitHub</small>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
            {getRepoList().length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: '#999' }}>
                  {activeTab === 'private' && !githubToken 
                    ? 'Enter your GitHub Personal Access Token to view private repositories'
                    : activeTab === 'private' 
                      ? 'No private repositories found'
                      : 'No repositories found'}
                </p>
              </div>
            )}
          </Card>
        </>
      ) : (
        <Card>
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <GithubOutlined style={{ fontSize: 60, color: "#ccc" }} />
            <h3 style={{ marginTop: 20 }}>No GitHub Profile Connected</h3>
            <p style={{ color: "#666" }}>
              Enter your GitHub username above to view your repositories. 
              Add a Personal Access Token to see private repositories.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

export default Github;
