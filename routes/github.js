import express from "express";
import axios from "axios";
import authMiddleware from "../middleware/auth.js";
import requireRole from "../middleware/role.js";
import User from "../models/user.js";

const githubRouter = express.Router();

// Get GitHub username for current student
githubRouter.get("/username", authMiddleware, requireRole("student"), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ githubUsername: user.githubUsername || "" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to fetch GitHub username" });
  }
});

// Save GitHub username
githubRouter.post("/username", authMiddleware, requireRole("student"), async (req, res) => {
  try {
    const { githubUsername } = req.body;
    const user = await User.findById(req.user._id);
    user.githubUsername = githubUsername;
    await user.save();
    res.json({ message: "GitHub username saved", githubUsername });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to save GitHub username" });
  }
});

// Get GitHub user profile and repositories
githubRouter.get("/profile", authMiddleware, requireRole("student"), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const githubUsername = user.githubUsername;

    if (!githubUsername) {
      return res.status(400).json({ message: "GitHub username not set" });
    }

    // Fetch user profile
    const profileResponse = await axios.get(`https://api.github.com/users/${githubUsername}`, {
      headers: { Accept: "application/vnd.github.v3+json" }
    });

    // Fetch repositories
    const reposResponse = await axios.get(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=10`, {
      headers: { Accept: "application/vnd.github.v3+json" }
    });

    res.json({
      profile: profileResponse.data,
      repositories: reposResponse.data
    });
  } catch (err) {
    console.error("GitHub API error:", err.response?.data || err.message);
    if (err.response?.status === 404) {
      return res.status(404).json({ message: "GitHub user not found" });
    }
    res.status(500).json({ message: "Unable to fetch GitHub data" });
  }
});

// Get specific repository details
githubRouter.get("/repo/:owner/:repo", authMiddleware, requireRole("student"), async (req, res) => {
  try {
    const { owner, repo } = req.params;

    const [repoResponse, commitsResponse, pullRequestsResponse] = await Promise.all([
      axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: { Accept: "application/vnd.github.v3+json" }
      }),
      axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`, {
        headers: { Accept: "application/vnd.github.v3+json" }
      }),
      axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls?state=all&per_page=5`, {
        headers: { Accept: "application/vnd.github.v3+json" }
      })
    ]);

    res.json({
      repository: repoResponse.data,
      recentCommits: commitsResponse.data,
      pullRequests: pullRequestsResponse.data
    });
  } catch (err) {
    console.error("GitHub API error:", err.response?.data || err.message);
    res.status(500).json({ message: "Unable to fetch repository data" });
  }
});

export default githubRouter;
