import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String, // optional for Google sign-in
      select: false // hides password when querying
    },

    // Google Auth Support
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows unique + optional
    },

    googleAccount: {
      type: Boolean,
      default: false,
    },

    // ⭐ Skill Hub XP / Level fields
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

// ✅ prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
