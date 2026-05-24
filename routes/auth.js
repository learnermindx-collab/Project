// const router = express.Router();
// import express from "express";
// import User from "../models/user.js";
// import auth from "../middleware/auth.js";
// import requireRole from "../middleware/role.js";
// router.get("/me", auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id || req.user._id).select("name email role");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json({ success: true, user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Get all supervisors (for HOD)
// router.get("/supervisors", auth, requireRole("hod"), async (req, res) => {
//   try {
//     const supervisors = await User.find({ role: "supervisor" }).select("name email _id");
//     res.json(supervisors);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Unable to load supervisors" });
//   }
// });
// export default router;


// import express from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import User from "../models/user.js"; 
// const router = express.Router();
// const The_mail = 'xandex123@gmail.com';
// // SIGNUP Route
// router.post("/signup", async (req, res) => {
//   const { name, email, password } = req.body;
//   if( email !== The_mail){
//     return res.status(400).json({ message: "Only admin can signup."});
//   }

//   if (!name || !email || !password) {
//     return res.status(400).json({ message: "All fields are required." });
//   }

//   if (password.length < 6) {
//     return res.status(400).json({ message: "Password must be at least 6 characters." });
//   }

//   try {
//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already exists." });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role: 'HOD',
//     });

//     await newUser.save();

//     res.status(201).json({ message: "Signup successful! You can now log in." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error, please try again." });
//   }
// });

// // LOGIN Route
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   // Check if email and password are provided
//   if (!email || !password) {
//     return res.status(400).json({ success: false, message: "Email and password are required." });
//   }

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ success: false, message: "Invalid email or password." });
//     }

//     // Compare the password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ success: false, message: "Invalid email or password." });
//     }

   
    

//     // Send the response
//     res.status(200).json({
//       success: true,
//       message: "Login successful!",
//       role: user.role, 
//         });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ success: false, message: "Server error. Please try again later." });
//   }

// });
//  //Addsupervisor Route

// router.post("/addsupervisor", async (req, res) => {
//     const { name, email, password, role } = req.body;
  
//     if (role !== "Supervisor") {
//       return res.status(400).json({ message: "Invalid role for supervisor." });
//     }
  
//     try {
//       // Check if supervisor email already exists
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({ message: "Email already exists." });
//       }
//       const hashedPassword = await bcrypt.hash(password, 10);
//       // Create a new supervisor
//       const newSupervisor = new User({
//         name,
//         email,
//         password: hashedPassword,
//         role,
//         isPasswordSet: true,
//       });
  
//       await newSupervisor.save();
//       res.status(201).json({ message: "Supervisor added successfully!" });
//     } catch (error) {
//       console.error("Add Supervisor Error:", error);
//       res.status(500).json({ message: "Server error, please try again." });
//     }

// });
// router.post("/addstudent", async (req, res) => {
//   const { name, email, password, role } = req.body;

//   if (role !== "student") {
//     return res.status(400).json({ success: false, message: "Invalid role for student." });
//   }

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ success: false, message: "Email already exists." });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newStudent = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       isPasswordSet: true,
//     });

//     await newStudent.save();

//     res.status(201).json({
//       success: true,
//       message: "Student added successfully!",
//       role: newStudent.role,
//     });

//   } catch (error) {
//     console.error("Add Student Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// export default router;








import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.js";
import auth from "../middleware/auth.js";
import requireRole from "../middleware/role.js";
import { generateResetToken } from "../utils/resetToken.js";

const router = express.Router();
const RESET_EXPIRY_MINUTES = 5;
const MAX_ATTEMPTS = 3;
const The_mail = "piku450@gmail.com";
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET not defined");
}

// SIGNUP Route (HOD only)
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (email !== The_mail) {
    return res.status(400).json({ message: "Only admin can signup." });
  }

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "hod",
    });

    await newUser.save();
    res.status(201).json({ message: "Signup successful! You can now log in." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again." });
  }
});

// LOGIN Route (now issues token)
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ success: false, message: "Email and password are required." });
//   }

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ success: false, message: "Invalid email or password." });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ success: false, message: "Invalid email or password." });
//     }

//     // 🔐 SIGN TOKEN
//     const token = jwt.sign(
//       { id: user._id, role: user.role?.toLowerCase?.(), tokenVersion: user.tokenVersion },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Login successful!",
//       token,
//       role: user.role?.toLowerCase?.(),
//     });

//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ success: false, message: "Server error. Please try again later." });
//   }
// });

// routes/auth.js - LOGIN Route (CLEAN VERSION)
// LOGIN Route - FIXED VERSION
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    // ✅ FIX: Consistent role casing and include tokenVersion
    const normalizedRole = user.role?.toLowerCase();
    
    const token = jwt.sign(
      { 
        id: user._id, 
        role: normalizedRole, 
        tokenVersion: user.tokenVersion || 0 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log(`✅ Login successful - User: ${user.email}, Role: ${normalizedRole}, TokenVersion: ${user.tokenVersion || 0}`);

    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      role: normalizedRole,
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
});

// LOGOUT Route (revokes existing token)
router.post("/logout", auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $inc: { tokenVersion: 1 } });
    return res.status(200).json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
});

// FIXED: Added missing /api/auth/me endpoint (caused 0.02s login rollback)
// Date: $(date +%Y-%m-%d %H:%M)
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("name email role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error("GET /me error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Add Supervisor
router.post("/addsupervisor", auth, requireRole("hod"), async (req, res) => {
  const { name, email, password, role } = req.body;

  if (role !== "supervisor") {
    return res.status(400).json({ message: "Invalid role for supervisor." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSupervisor = new User({
      name,
      email,
      password: hashedPassword,
      role,
      isPasswordSet: true,
    });

    await newSupervisor.save();
    res.status(201).json({ message: "Supervisor added successfully!" });
  } catch (error) {
    console.error("Add Supervisor Error:", error);
    res.status(500).json({ message: "Server error, please try again." });
  }
});

// Add Student
router.post("/addstudent", auth, requireRole("hod"), async (req, res) => {
  const { name, email, password, role } = req.body;

  if (role !== "student") {
    return res.status(400).json({ success: false, message: "Invalid role for student." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new User({
      name,
      email,
      password: hashedPassword,
      role,
      isPasswordSet: true,
    });

    await newStudent.save();

    res.status(201).json({
      success: true,
      message: "Student added successfully!",
      role: newStudent.role,
    });

  } catch (error) {
    console.error("Add Student Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ---------------- FORGOT PASSWORD ---------------- */

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "If account exists, continue." });
  }

  const { rawToken, tokenHash } = generateResetToken();
  const challengeCode = Math.floor(100000 + Math.random() * 900000).toString();

  user.passwordReset = {
    tokenHash: crypto
      .createHash("sha256")
      .update(rawToken + challengeCode)
      .digest("hex"),
    expiresAt: new Date(Date.now() + RESET_EXPIRY_MINUTES * 60 * 1000),
    attempts: 0
  };

  await user.save();

  res.json({
    challengeCode,
    resetToken: rawToken,
    expiresInMinutes: RESET_EXPIRY_MINUTES
  });
});

/* ---------------- RESET PASSWORD ---------------- */

router.post("/reset-password", async (req, res) => {
  const { email, resetToken, challengeCode, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.passwordReset) {
    return res.status(400).json({ error: "Invalid or expired reset." });
  }

  const { expiresAt, attempts, tokenHash } = user.passwordReset;

  if (Date.now() > expiresAt.getTime() || attempts >= MAX_ATTEMPTS) {
    user.passwordReset = undefined;
    await user.save();
    return res.status(400).json({ error: "Reset expired." });
  }

  const incomingHash = crypto
    .createHash("sha256")
    .update(resetToken + challengeCode)
    .digest("hex");

  if (incomingHash !== tokenHash) {
    user.passwordReset.attempts += 1;
    await user.save();
    return res.status(400).json({ error: "Invalid challenge." });
  }

  const salt = await bcrypt.genSalt(12);
  user.passwordHash = await bcrypt.hash(newPassword, salt);

  user.passwordReset = undefined;
  user.tokenVersion += 1;

  await user.save();

  res.json({ message: "Password reset successful. Login again." });
});

// Get all supervisors (for HOD)
router.get("/supervisors", auth, requireRole("hod"), async (req, res) => {
  try {
    const supervisors = await User.find({ role: "supervisor" }).select("name email _id");
    res.json(supervisors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to load supervisors" });
  }
});

export default router;