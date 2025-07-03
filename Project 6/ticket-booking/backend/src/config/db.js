import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config()
const CONNECTION_URL = process.env.MONGO_URI;

export async function connectDB() {
    try {
        await mongoose.connect(CONNECTION_URL);
        console.log("MongoDB connected successfully...!");
    } catch (error) {
        console.error("Error connecting to database:", error);
        process.exit(1);
    }
}