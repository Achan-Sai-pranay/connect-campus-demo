import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ REGISTER (Normal signup)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists ❌" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server Error ❌" });
  }
};

// ✅ GOOGLE REGISTER / LOGIN
export const googleRegister = async (req, res) => {
  try {
    const { name, email } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      // create new user if not exist
      user = await User.create({
        name,
        email,
        authType: "google",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Google Auth Failed ❌" });
  }
};
