import mongoose from "mongoose";

const connectionString =
  process.env.MONGODB_URI || "mongodb://localhost:27017/neo-id-scanner";

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
