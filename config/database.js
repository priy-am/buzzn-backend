import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({
    path:"./.env"
})
// const monoUrl = process.env.MONGO_URL;
// const monoUrl = "mongodb://localhost:27017/twitterClone"
const monoUrl = "mongodb+srv://codepriyam:Priyam@8800@cluster-url/test?retryWrites=true&w=majority"

const databaseConnection = ()=>{
    mongoose.connect(monoUrl).then(()=>{
        console.log(`connected to monogoDB`)
    }).catch((error)=>{
        console.log(error)
    })
}

export default databaseConnection;