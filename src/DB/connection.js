import mongoose from "mongoose";

const uri = process.env.DB_URI
const connentDB = async () => {   
  try {
    await mongoose.connect(uri,{serverSelectionTimeoutMS: 5000});
    console.log("Connected Successfully to Database.");
  } catch (error) {
    console.log(`Failed to connect:${error.message} `);
  }
};

export default connentDB
