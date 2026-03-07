// // middleware/auth.js
// import jwt from "jsonwebtoken";
// import User from "../models/user.js";

// export default async function auth(req, res, next) {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token" });

//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   const user = await User.findById(decoded.id).select("-password");

//   if (!user) return res.status(401).json({ message: "User not found" });

//   req.user = user;
//   next();
// }


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

    if (decoded.tokenVersion !== undefined && user.tokenVersion !== decoded.tokenVersion) {
      console.log("Token revoked");
      return res.status(401).json({ message: "Token revoked" });
    }

    req.user = user;
    console.log("Auth successful for user:", user._id, user.role);
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
