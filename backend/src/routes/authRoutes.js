import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { googleSignInHandler } from "../controllers/googleController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-signin", googleSignInHandler);

export default router;
