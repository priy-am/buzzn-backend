import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({
    path:"./.env"
})
const monoUrl = process.env.MONGO_URL;

const databaseConnection = ()=>{
    mongoose.connect(monoUrl).then(()=>{
        console.log(`connected to monogoDB`)
    }).catch((error)=>{
        console.log(error)
    })
}

export default databaseConnection;