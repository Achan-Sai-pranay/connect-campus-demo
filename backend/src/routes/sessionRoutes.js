import express from "express";
import Session from "../models/Session.js";

const router = express.Router();

// GET all sessions
router.get("/", async (req, res) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 });
    const totalFP = sessions.reduce((sum, s) => sum + s.fp, 0);
    const completedSessions = sessions.length;
    res.json({ sessions, totalFP, completedSessions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
});

// POST a new session
router.post("/", async (req, res) => {
  try {
    const { topic = "Unknown", duration } = req.body;
    const dur = Number(duration);
    if (!dur || dur <= 0) return res.status(400).json({ error: "Invalid duration" });

    const fp = Math.round(dur * 2); // 1 min = 2 FP
    const session = new Session({ topic, duration: dur, fp });
    await session.save();

    res.status(201).json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save session" });
  }
});

// DELETE all sessions (reset)
router.delete("/", async (req, res) => {
  try {
    await Session.deleteMany({});
    res.json({ message: "All sessions deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete sessions" });
  }
});

export default router;

