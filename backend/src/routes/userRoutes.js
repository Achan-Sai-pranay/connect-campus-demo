// routes/userRoutes.js
import express from "express";
import { getUsers, updateXp } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.put("/:name/xp", updateXp);

export default router;
