import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;
const MONGO_DB_NAME = process.env.MONGODB_DB_NAME;

if (!MONGO_URI || !MONGO_DB_NAME) {
  throw new Error(
    "Please provide MONGO_URI and MONGO_DB_NAME in the environment variables",
  );
}

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      dbName: MONGO_DB_NAME,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
