import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./src/routes/authRoutes.js";
import sessionRoutes from "./src/routes/sessionRoutes.js";   // Prod sessions (existing)
import skillRoutes from "./src/routes/skillRoutes.js";       // ✅ SkillHub routes
import userRoutes from "./src/routes/userRoutes.js";         // ✅ Leaderboard / XP routes

dotenv.config();

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json()); // Parse JSON body

// ✅ Health check (required for frontend testing)
app.get("/api", (req, res) => {
  res.json({ message: "API is working ✅" });
});

// ✅ Register Routes
app.use("/api/auth", authRoutes);        // Login / Register / Google Auth
app.use("/api/sessions", sessionRoutes); // Productivity sessions
app.use("/api/skills", skillRoutes);     // SkillHub features (requests)
app.use("/api/users", userRoutes);       // XP & leaderboard updates

// ✅ Global Error Middleware
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
