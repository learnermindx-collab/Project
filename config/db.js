import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const { DB } = process.env;
const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.DB);;
        console.log("Mongo_DB connected successfully!");
    } catch (error){
        console.error("Mongo_DB connection failed", error.message);
        process.exit(1);

    }

};

 export default connectDB;
