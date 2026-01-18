import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

/* User Registration */
router.post("/register", async (req, res) => {
  try {
    /* Salting and Hashing the Password */
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    // Provide defaults for missing optional fields to avoid validation errors
    const newuser = new User({
      userType: req.body.userType,
      userFullName: req.body.userFullName,
      admissionId: req.body.admissionId || '',
      employeeId: req.body.employeeId || '',
      age: req.body.age || 0,
      dob: req.body.dob || '',
      gender: req.body.gender || '',
      address: req.body.address || '',
      mobileNumber: req.body.mobileNumber || 0,
      email: req.body.email,
      password: hashedPass,
      isAdmin: req.body.isAdmin || false,
    });

    /* Save User and Return */
    const user = await newuser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    let msg = 'Signup failed';
    if (err.code === 11000) {
      if (err.keyPattern && err.keyPattern.email) msg = 'Email already exists';
      else if (err.keyPattern && err.keyPattern.userFullName) msg = 'Name already exists';
    } else if (err.errors) {
      msg = Object.values(err.errors).map(e => e.message).join(', ');
    }
    res.status(400).json({ message: msg });
  }
});

/* User Login */
router.post("/signin", async (req, res) => {
  try {
    console.log(req.body, "req");
    const user = req.body.admissionId
      ? await User.findOne({
          admissionId: req.body.admissionId,
        })
      : await User.findOne({
          employeeId: req.body.employeeId,
        });

    console.log(user, "user");

    !user && res.status(404).json("User not found");

    const validPass = await bcrypt.compare(req.body.password, user.password);
    !validPass && res.status(400).json("Wrong Password");

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

export default router;
