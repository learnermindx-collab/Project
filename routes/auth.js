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
import User from "../models/user.js";
import auth from "../middleware/auth.js";
import requireRole from "../middleware/role.js";


const router = express.Router();
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

    // 🔐 SIGN TOKEN
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      role: user.role,
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
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

export default router;
