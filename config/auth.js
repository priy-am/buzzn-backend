import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config({
    path:"../.env"
})
const isAuthenticated = async (req, res, next)=>{
    const TOKEN_SCREACT = "fpfidjclskdiwoiueocdzmnv"
try {
    const token= req.cookies.token;
    console.log(`req:- ${req}`);
    console.log(`req.cookies: ${JSON.stringify(req.cookies)}`);
    console.log(`token:- ${token}`)
    

    if(!token){
        return res.status(401).json({
            message:"user is not authenticated",
            success:false
        })
    }
    const decode = await jwt.verify(token, TOKEN_SCREACT);
    console.log(`Token secret: ${TOKEN_SCREACT}`);
    console.log(`JWT verify: ${JSON.stringify(decode)}`);
    req.user = decode.userId;
    next();
} catch (error) {
    console.log(`network error :- ${error}`)
}
}

export default isAuthenticated;