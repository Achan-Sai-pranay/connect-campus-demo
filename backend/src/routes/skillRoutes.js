// routes/skillRoutes.js
import express from "express";
import { getSkills, addSkill, acceptSkill, completeSkill } from "../controllers/skillController.js";

const router = express.Router();

router.get("/", getSkills);
router.post("/", addSkill);
router.put("/:id/accept", acceptSkill);
router.put("/:id/complete", completeSkill);

export default router;
