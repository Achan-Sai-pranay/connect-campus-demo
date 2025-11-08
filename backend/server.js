import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./src/routes/authRoutes.js";
import sessionRoutes from "./src/routes/sessionRoutes.js";   
import skillRoutes from "./src/routes/skillRoutes.js";       
import userRoutes from "./src/routes/userRoutes.js";         

dotenv.config();

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ CORS configuration
app.use(cors({
  origin: [
    "http://localhost:3000",                   // Local frontend
    process.env.FRONTEND_URL                    // Deployed frontend
  ],
  credentials: true,
}));

// ✅ Middleware to parse JSON
app.use(express.json());

// ✅ Health check (optional but recommended)
app.get("/api", (req, res) => {
  res.json({ message: "API is working ✅" });
});

// ✅ Register Routes
app.use("/api/auth", authRoutes);        
app.use("/api/sessions", sessionRoutes); 
app.use("/api/skills", skillRoutes);     
app.use("/api/users", userRoutes);       

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
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
