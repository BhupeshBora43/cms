import {config} from 'dotenv';
config();
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const connectToDB = async() =>{
    try{
        console.log(`MONGO URI :${MONGODB_URI}`)
        const connection = await mongoose.connect(MONGODB_URI)
    }catch(err){
        console.log("connection to database failed");
        process.exit(1);
    }
};

export default connectToDB;