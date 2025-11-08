// models/Skill.js
import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    postedBy: { type: String, required: true }, // simple username string (no auth here)
    status: {
      type: String,
      enum: ["open", "accepted", "completed"],
      default: "open",
    },
    acceptedBy: { type: String, default: null },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export default mongoose.model("Skill", SkillSchema);
