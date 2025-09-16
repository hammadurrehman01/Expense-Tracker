import { connect } from "mongoose";

export const connectDB = async () => {
  try {
    const connection = await connect(process.env.MONGO_URL);
    if (connection) {
      console.log("Database Connected!");
    } else {
      console.log("Mongo was not be able to connect yet");
    }
  } catch (error) {
    console.log(`Error: ${error?.message}`);
  }
};
