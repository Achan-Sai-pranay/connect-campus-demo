import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import sessionRoutes from "./src/routes/sessionRoutes.js"; // Productivity sessions

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Parse JSON body

// Routes
app.use("/api/auth", authRoutes);         // Authentication routes
app.use("/api/sessions", sessionRoutes);  // Productivity session routes

// Health check
app.get("/", (req, res) => {
  res.send("✅ Backend Running...");
});

// Error handler middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
