import mongoose from "mongoose";

const connectionURL = (
  process.env.NODE_ENV === "development"
    ? process.env.MONGO_DB_LOCAL
    : `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`
) as string;

const connectDB = async () => {
  try {
    await mongoose.connect(connectionURL);
    console.log("MongoDB connected..");
  } catch (error: unknown) {
    console.error(error as Error);
    process.exit(1);
  }
};

export default connectDB;
