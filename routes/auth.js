import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js"; // Make sure your User model is correctly set up

const router = express.Router();
const The_mail = 'iamsamaiya555@gmail.com';
// SIGNUP Route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if( email !== The_mail){
    return res.status(400).json({ message: "Only admin can signup."});
  }

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'HOD',
    });

    await newUser.save();

    res.status(201).json({ message: "Signup successful! You can now log in." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again." });
  }
});

// // LOGIN Route
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required." });
//   }

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "User not found. Please Signup first!." });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Password don't match. Enter correct password!" });
//     }

//     res.status(200).json({
//       message: "Login successful!",
//       role: user.role, 
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error, please try again." });
//   }
//});


// LOGIN Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

   
    

    // Send the response
    res.status(200).json({
      success: true,
      message: "Login successful!",
      role: user.role, 
        });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
});



export default router;
