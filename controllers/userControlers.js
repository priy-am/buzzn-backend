import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Tweet } from "../models/tweetSchema.js";

dotenv.config({
  path: "./.env",
});
//register
export const Register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    console.log(req.body)
    const users = await User.find({
      $or: [{ email: email }, { username: username }],
    });
    console.log(users)

    if (users.length > 0) {
      return res.status(401).json({
        message: "User already exists with this email or username",
        success: false,
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 16);
    await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "Account created succesfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//login

export const Login = async (req, res) => {
  try {
    const TOKEN_SCREACT = "fpfidjclskdiwoiueocdzmnv"
    // const TOKEN_SCREACT = process.env.TOKEN_SCREACT
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "wrong email or password",
        success: false,
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "That email/username and password combination didn't work. Try again.",
        success: false,
      });
    }
    const tokenData = {
      userId: user._id
    }
    const token = await jwt.sign(tokenData, TOKEN_SCREACT, { expiresIn: "1d", });
    return res.status(200).cookie("token", token, { expiresIn: "1d", httpOnly: true, sameSite: "None", }).json({
      message: `Wellcome back ${user.name}`,
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const LogOut = (req, res) => {
  return res.cookie("token", "", { expiresIn: new Date(Date.now()) }).json({
    message: "User Logout Successfully",
    success: true
  })
}

export const Bookmarks = async (req, res) => {
  try {
    console.log(req)
    const loggedInUser = req.body.id;
    const tweetId = req.params.id;
    const user = await User.findById(loggedInUser)
    
    const filteredBookmarks = user.bookmarks.filter(bookmarkedTweet => bookmarkedTweet !== null);
    const tweet = await Tweet.findById(tweetId)

    const tweetExistsInBookmarks = user.bookmarks.some(bookmarkedTweet => {
      if (bookmarkedTweet && bookmarkedTweet._id) {
        return bookmarkedTweet._id.equals(tweet._id);
      }
      return false;
    });

    if (tweetExistsInBookmarks) {
      //remove bookmark
      await User.findByIdAndUpdate(loggedInUser, { $pull: { bookmarks: { _id: tweet._id } }});
      return res.status(200).json({
        message: "Unmarked"
      })
    } else {
      //bookmark
      await User.findByIdAndUpdate(loggedInUser, { $push: { bookmarks: tweet } });
      return res.status(200).json({
        message: "Bookmarked",
        tweet
      })
    }
  } catch (error) {
    console.log(`server error:- ${error}`)
  }
}

export const getMyProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-password")
    return res.status(200).json({
      user
    })
  } catch (error) {
    console.log(error)
  }
}

export const getOtherUser = async (req, res) => {
  try {
    const { id } = req.params;
    const otherUsers = await User.find({ _id: { $ne: id } }).select("-password")
    if (!otherUsers) {
      return res.status(401).json({
        message: "Currently do not have any user",
      })
    }
    return res.status(200).json({
      otherUsers
    })
  } catch (error) {
    console.log(error)
  }
}

export const follow = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const otherUserId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId);
    const otherUser = await User.findById(otherUserId);

    if(!loggedInUser || !otherUser){
      return res.status(404).json({
        message:" user not found",
        success:false
      })
    }


    if (otherUser.followers.includes(loggedInUserId)) {
      //unfollow
      await otherUser.updateOne({ $pull: { followers: loggedInUserId } })
      await loggedInUser.updateOne({ $pull: { following: otherUserId } })
      res.status(200).json({
        message: `unfollow to ${otherUser.name}`,
        success:true
      })

    } else {
      //follow
      await otherUser.updateOne({ $push: { followers: loggedInUserId } })
      await loggedInUser.updateOne({ $push: { following: otherUserId } })
    }
    res.status(200).json({
      message: `you follow to ${otherUser.name}`,
      success: true
    })
  } catch (error) {
    console.log(error)
  }
}