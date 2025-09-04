import express from "express";
import User from "../models/User.js";

const router = express.Router();

// @route            POST /api/auth/register
// @description      Register a new user
// @access           Public

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please provide all required fields");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (e) {
    next(e);
  }
});

export default router;
