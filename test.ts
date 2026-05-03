import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" }); // 👈 FIX HERE

console.log("ENV:", process.env.MONGODB_URI); // debug

mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log("✅ CONNECTED"))
  .catch(err => console.log("❌ ERROR", err));