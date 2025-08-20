import mongoose from "mongoose";

export const connectDB = async () =>{
    try {
        const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/foodie-app";
        await mongoose.connect(mongoURI);
        console.log('db connected');
    } catch (error) {
        console.log('Database connection failed, starting without DB:', error.message);
        // Continue without database for demo purposes
    }
}