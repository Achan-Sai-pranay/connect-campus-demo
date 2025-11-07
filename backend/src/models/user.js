import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true
    },
    password: { 
      type: String 
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    googleAccount: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite error
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
