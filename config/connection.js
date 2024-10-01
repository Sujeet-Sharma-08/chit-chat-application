import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB database successfully!');
    } catch (error) {
        console.error('Error while connecting to MongoDB:', error.message);
        throw new Error('Failed to connect to MongoDB');
    }
}

export default connection;
