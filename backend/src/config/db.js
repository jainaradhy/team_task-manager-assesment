import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod = null;

export const connectDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI?.trim();

    if (!uri) {
      throw new Error(
        "MONGODB_URI is not set. Set the MongoDB Atlas connection string in your environment variables."
      );
    }

    console.log("⏳ Connecting to MongoDB...");
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log("✅ MongoDB connected");
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.log("⚠️ MongoDB connection failed. Starting In-Memory MongoDB...");
        await mongoose.disconnect();
        mongod = await MongoMemoryServer.create();
        const fallbackUri = mongod.getUri();
        await mongoose.connect(fallbackUri);
        console.log("✅ MongoDB connected (In-Memory)");
      } else {
        throw err;
      }
    }
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};
