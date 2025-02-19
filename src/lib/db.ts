import mongoose from "mongoose";

const connectionString = process.env.MONGODB_URI || "";

if (connectionString.length === 0) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

let cachedConnection: typeof mongoose | null = null;

async function connectDB(): Promise<typeof mongoose> {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    cachedConnection = await mongoose.connect(connectionString);
    return cachedConnection;
  } catch (error) {
    throw error;
  }
}

export default connectDB;
