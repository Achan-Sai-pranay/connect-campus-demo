import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/** ✅ REGISTER USER */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User Registered Successfully",
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/** ✅ GOOGLE LOGIN / REGISTER */
export const googleRegister = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Google token from frontend
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, name, email } = payload;

    let user = await User.findOne({ email });

    // If new user, create
    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        googleAccount: true,
      });
    }

    res.status(200).json({
      message: "Google Sign-In Successful",
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: "Google sign-in failed",
      error: error.message,
    });
  }
};

/** ✅ LOGIN USER */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.googleAccount)
      return res
        .status(400)
        .json({ message: "This account is registered using Google. Please login with Google." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    res.status(200).json({
      message: "Login Successful",
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
