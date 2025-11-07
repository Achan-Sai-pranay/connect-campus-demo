import express from "express";
import { registerUser, loginUser, googleRegister } from "../controllers/authController.js";

const router = express.Router();

// Normal register + login
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ Google register/login
router.post("/google", googleRegister);

export default router;
