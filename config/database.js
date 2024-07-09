import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({
    path:"./.env"
})
// const monoUrl = process.env.MONGO_URL;
// const monoUrl = "mongodb://localhost:27017/twitterClone"
const monoUrl = "mongodb+srv://codepriyam:<codepriyamkumari>@cluster0.cuyr0si.mongodb.net/"

const databaseConnection = ()=>{
    mongoose.connect(monoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 50000, // Increase timeout to 50 seconds
        socketTimeoutMS: 45000          // Close sockets after 45 seconds of inactivity
    }).then(()=>{
        console.log(`connected to monogoDB`)
    }).catch((error)=>{
        console.log(error)
    })
}

export default databaseConnection;