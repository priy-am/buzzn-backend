import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import databaseConnection from './config/database.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js'
import tweetRoutes from './routes/tweetRoutes.js'
import cors from 'cors'
dotenv.config({
    path:".env"
})
const app = express();
databaseConnection();

//middlewares
app.use(urlencoded({
    extended:true
}))
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:5173', // Allow this origin
    methods: 'GET,POST,PUT,DELETE', // Allow these methods
    allowedHeaders: 'Content-Type', // Allow the Content-Type header
    credentials: true
};
app.use(cors(corsOptions));

//api
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/tweet", tweetRoutes)



app.listen(process.env.PORT,()=>{
    console.log(`Example app listening on port ${process.env.port}`)
})

