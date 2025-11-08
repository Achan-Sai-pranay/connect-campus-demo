// controllers/skillController.js
import Skill from "../models/Skill.js";
import User from "../models/user.js";

/**
 * GET /api/skills
 * optional query: ?status=open
 */
export const getSkills = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const skills = await Skill.find(filter).sort({ createdAt: -1 }).lean();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch skills", error: err.message });
  }
};

/**
 * POST /api/skills
 * body: { title, description, postedBy }
 */
export const addSkill = async (req, res) => {
  try {
    const { title, description, postedBy } = req.body;
    if (!title || !postedBy) return res.status(400).json({ message: "title & postedBy required" });

    // ensure user exists (create fallback user)
    await User.findOneAndUpdate({ name: postedBy }, { $setOnInsert: { xp: 0, level: 1 } }, { upsert: true });

    const skill = await Skill.create({ title, description, postedBy });
    res.status(201).json(skill);
  } catch (err) {
    res.status(500).json({ message: "Failed to add skill", error: err.message });
  }
};

/**
 * PUT /api/skills/:id/accept
 * body: { accepter }   -- who accepted the request
 */
export const acceptSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { accepter } = req.body;
    if (!accepter) return res.status(400).json({ message: "accepter required" });

    const skill = await Skill.findById(id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    if (skill.status !== "open") return res.status(400).json({ message: "Skill not open to accept" });

    skill.status = "accepted";
    skill.acceptedBy = accepter;
    await skill.save();

    // ensure accepter user exists
    await User.findOneAndUpdate({ name: accepter }, { $setOnInsert: { xp: 0, level: 1 } }, { upsert: true });

    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: "Failed to accept skill", error: err.message });
  }
};

/**
 * PUT /api/skills/:id/complete
 * marks completed
 * Optionally, you could credit XP here, but we have a dedicated XP endpoint.
 */
export const completeSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findById(id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    skill.status = "completed";
    await skill.save();
    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: "Failed to complete skill", error: err.message });
  }
};
