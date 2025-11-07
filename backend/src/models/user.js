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
      unique: true // Ensure emails are unique
    },
    password: { 
      type: String 
    }, // Optional for Google sign-ups
    
    // --- Essential for Google Sign-In ---
    googleId: { 
      type: String, 
      unique: true, // This ID must be unique across all Google users
      sparse: true  // Allows standard users (without googleId) to exist
    },
    provider: { // Tracks the sign-up method (e.g., 'standard' or 'google')
      type: String, 
      enum: ['standard', 'google'], 
      default: 'standard',
      required: true
    },
  },
  { timestamps: true }
);

// NEW (prevents OverwriteModelError)
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

