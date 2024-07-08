import { Tweet } from "../models/tweetSchema.js"
import { User } from "../models/userSchema.js"

export const createTweet = async(req, res)=>{
    try {
        const {description, id} = req.body
        if(!description || !id){
            return res.status(401).json({
                message:"Fields are required",
                success:false
            })
        }
        const user = await User.findById(id).select("-password");
        await Tweet.create({
            description,
            userId:id,
            userDetails: user
        })
        return res.status(201).json({
            message:"Tweet created successfully.",
            success:true
        })
    } catch (error) {
        console.log(`network error:- ${error}`)
    }
}

export const deleteTweet = async(req, res)=>{
    try {
        const {id} = req.params
        await Tweet.findByIdAndDelete(id);
        return res.status(200).json({
            message:"Tweet deleted successfully",
            success: true
        })
    } catch (error) {
        console.log(`network error:- ${error}`)
    }
}

export const likeOrDislike = async(req, res)=>{
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const tweet = await Tweet.findById(tweetId)
        console.log(`loggedInUserId:- ${loggedInUserId}`)
        console.log(`tweetId:- ${tweetId}`)
        if(tweet.likes.includes(loggedInUserId)){
            //dislike
            await Tweet.findByIdAndUpdate(tweetId, {$pull: {likes:loggedInUserId}})
            return res.status(200).json({
                message:"Someone dislike your post",
            })
        }else{
            //like
            await Tweet.findByIdAndUpdate(tweetId, {$push:{likes:loggedInUserId}})
            return res.status(200).json({
                message:"User like you post",

            })
        }
    } catch (error) {
        console.log(error)
    }
}

export const getAllTweet = async(req, res)=>{
     // owntweet + other tweet
    try {
        const id = req.params.id;
        const logedInUser = await User.findById(id)
        const logedInUserTweets = await Tweet.find({userId:id})
        const followingUserTweets = await Promise.all(logedInUser.following.map((otherUserId)=>{
            return  Tweet.find({userId:otherUserId})
        }))
        return res.status(200).json({
            tweets:logedInUserTweets.concat( ...followingUserTweets)
        })
    } catch (error) {
        console.log(`network error :- ${error}`)
    }
}

export const getFollowingTweet = async (req, res)=>{
    try {
        const id = req.params.id;
        const logedInUser = await User.findById(id)
        const followingUserTweets = await Promise.all(logedInUser.following.map((otherUserId)=>{
            return Tweet.find({userId:otherUserId})
        }))
        return res.status(200).json({
            tweets:[].concat(...followingUserTweets)
        })
    } catch (error) {
        console.log(error)
    }
}