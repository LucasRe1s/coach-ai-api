import mongoose from "mongoose";
import "dotenv/config";
export const database = () => {
  const mongoUrl = process.env.MONGODB_URI || process.env.DATABASE_URL || process.env.DB_URL || "mongodb://localhost:27017/coach-ai";
  
  return mongoose.connect(mongoUrl)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    });
};

if (!process.env.MONGODB_URI && !process.env.DATABASE_URL && !process.env.DB_URL) {
  console.warn('MONGODB_URI, DATABASE_URL or DB_URL environment variable is missing. Using default.');
}

export default database;