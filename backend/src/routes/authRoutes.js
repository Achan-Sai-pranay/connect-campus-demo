import express from "express";
import { registerUser, googleRegister } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/google-register", googleRegister);

export default router;
