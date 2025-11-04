import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./src/routes/authRoutes.js";


dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Allows JSON body parsing

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
