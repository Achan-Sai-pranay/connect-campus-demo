// config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/skillsHub";

    const conn = await mongoose.connect(mongoUri);

    console.log("======================================");
    console.log("✅ MongoDB Connected Successfully");
    console.log(`🏠 Host: ${conn.connection.host}`);
    console.log(`📦 DB Name: ${conn.connection.name}`);
    console.log("======================================");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:");
    console.error(err.message);
    process.exit(1); // stop server if DB fails
  }
};

export default connectDB;
