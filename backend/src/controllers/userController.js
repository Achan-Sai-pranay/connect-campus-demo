// controllers/userController.js
import User from "../models/user.js";

/**
 * GET /api/users
 * returns all users sorted by xp desc
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ xp: -1 }).lean();
    // attach rank:
    const ranked = users.map((u, i) => ({ ...u, rank: i + 1 }));
    res.json(ranked);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

/**
 * PUT /api/users/:name/xp
 * body: { xpGain }  -> increments xp and updates level
 */
export const updateXp = async (req, res) => {
  try {
    const { name } = req.params;
    const { xpGain } = req.body;
    if (typeof xpGain !== "number") return res.status(400).json({ message: "xpGain must be a number" });

    const user = await User.findOne({ name });
    if (!user) {
      // create new user
      const newUser = new User({ name, xp: xpGain, level: Math.floor(xpGain / 100) + 1 });
      await newUser.save();
      return res.json(newUser);
    }

    user.xp += xpGain;
    user.level = Math.floor(user.xp / 100) + 1;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update xp", error: err.message });
  }
};
