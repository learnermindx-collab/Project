import express from 'express';


router.post("/addsupervisor", async (req, res) => {
    const { name, email, role } = req.body;
  
    if (role !== "Supervisor") {
      return res.status(400).json({ message: "Invalid role for supervisor." });
    }
  
    try {
      // Check if supervisor email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists." });
      }
  
      // Create a new supervisor
      const newSupervisor = new User({
        name,
        email,
        role,
        isPasswordSet: false, // Password will be set upon their first login
      });
  
      await newSupervisor.save();
      res.status(201).json({ message: "Supervisor added successfully!" });
    } catch (error) {
      console.error("Add Supervisor Error:", error);
      res.status(500).json({ message: "Server error, please try again." });
    }
  });
 
  export default router;