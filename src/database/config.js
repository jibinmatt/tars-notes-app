import mongoose from "mongoose";

const Connection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true })
    console.log("Database Connected successfully")
  } catch (err) {
    console.log("Error while connecting with database", err.message)
  }
}

export default Connection