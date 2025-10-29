import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
export const connectToDatabase = async () => {
    try {  
        const connection = await mongoose.connect(process.env.MONGO_URI);
        // console.log(connection)
        console.log(`MongoDB connected: ${connection.connection.host}`);
    }catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
    }
};

