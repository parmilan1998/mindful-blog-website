import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI not defined in environment");
    process.exit(1);
  }

  // Enable mongoose debug mode in development
  mongoose.set("debug", process.env.NODE_ENV === "development");
  mongoose.set("strictQuery", true);

  // Connection event listeners
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected successfully");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("MongoDB reconnected successfully");
  });

  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
  });

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

  try {
    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
