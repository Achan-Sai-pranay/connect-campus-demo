import User from "../models/user.js";

/**
 * Express handler for Google sign-in/sign-up
 */
export const googleSignInHandler = async (req, res) => {
  try {
    const { payload } = req.body; // payload from frontend (after token verification)
    const { sub: googleId, email, name } = payload;

    let user = await User.findOne({ googleId });

    if (user) {
      return res.status(200).json({ message: "Login successful", user });
    }

    user = await User.findOne({ email });

    if (user) {
      user.googleId = googleId;
      user.provider = "google";
      await user.save();
      return res.status(200).json({ message: "Login successful", user });
    }

    const newUser = new User({
      name,
      email,
      googleId,
      provider: "google",
    });

    await newUser.save();
    return res.status(201).json({ message: "Account created", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Google login failed", error: err.message });
  }
};
