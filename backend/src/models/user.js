import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // only normal register users have password
    authType: { type: String, enum: ["normal", "google"], default: "normal" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
