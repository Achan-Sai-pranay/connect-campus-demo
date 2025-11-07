import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  topic: { type: String, default: "Unknown" },
  duration: { type: Number, required: true },
  fp: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Session", sessionSchema);
