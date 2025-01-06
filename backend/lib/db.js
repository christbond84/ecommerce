import mongoose from "mongoose"

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`Connected to MongoDB host:${conn.connection.host}`)
  } catch (error) {
    console.error("Error in Database connection: " + error.message)
    process.exit(1)
  }
}
