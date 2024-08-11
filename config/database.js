import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({
    path:"./.env"
})
// const monoUrl = process.env.MONGO_URL;
// const monoUrl = "mongodb://localhost:27017/twitterClone"
// const monoUrl = "mongodb+srv://codepriyam:codepriyamkumari@cluster0.cuyr0si.mongodb.net/"
const monoUrl = "mongodb+srv://codepriyam:CodePriyam@buzzn.wyus4.mongodb.net/?retryWrites=true&w=majority&appName=buzzn"

const databaseConnection = ()=>{
    mongoose.connect(monoUrl).then(()=>{
        console.log(`connected to monogoDB`)
    }).catch((error)=>{
        console.log(error)
    })
}

export default databaseConnection;