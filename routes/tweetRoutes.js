import express from 'express'
import { createTweet, deleteTweet, getAllTweet, getFollowingTweet, likeOrDislike } from '../controllers/tweetControler.js'
import isAuthenticated from '../config/auth.js'

const router = express.Router()

router.route('/create').post( createTweet);
router.route('/delete/:id').delete( deleteTweet);
router.route('/like/:id').put( likeOrDislike);
router.route('/alltweets/:id').get( getAllTweet)
router.route('/followingtweets/:id').get(getFollowingTweet)

export default router;