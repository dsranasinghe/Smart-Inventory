import mongoose from "mongoose";


export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // 1 CODE MEANS EXIT WITH ERROR , 0 CODE MEANS SUCCESS
  }
};          