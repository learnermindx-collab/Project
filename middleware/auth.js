import jwt from "jsonwebtoken";
import User from "../models/user.js";

export default async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    console.log("Auth header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No token provided");
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token received:", token ? "present" : "empty");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.id).select("-password");
    console.log("User found:", user ? "yes" : "no");

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ FIX 1: Normalize roles for comparison
    const decodedRole = decoded.role?.toLowerCase();
    const userRole = user.role?.toLowerCase();
    
    if (decodedRole !== userRole) {
      console.log(`Role mismatch - Token: ${decodedRole}, DB: ${userRole}`);
      return res.status(401).json({ 
        message: "Session expired. Please log in again.", 
        logout: true 
      });
    }

    // ✅ FIX 2: Only check tokenVersion if it exists in token
    if (decoded.tokenVersion !== undefined) {
      if (user.tokenVersion !== decoded.tokenVersion) {
        console.log(`Token version mismatch - Token: ${decoded.tokenVersion}, DB: ${user.tokenVersion}`);
        return res.status(401).json({ 
          message: "Session expired. Please log in again.", 
          logout: true 
        });
      }
    }

    // ✅ FIX 3: Ensure user object has consistent role casing
    req.user = {
      ...user.toObject(),
      role: userRole // Force lowercase for consistency
    };
    
    console.log("Auth successful for user:", user._id, req.user.role);
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    
    // ✅ FIX 4: Better error messages
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token. Please log in again." });
    }
    
    return res.status(401).json({ message: "Authentication failed" });
  }
}