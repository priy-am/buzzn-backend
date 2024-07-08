import express from 'express'
import { Bookmarks, LogOut, Login, Register, follow, getMyProfile, getOtherUser } from '../controllers/userControlers.js';
import isAuthenticated from '../config/auth.js';

const router = express.Router();
router.route("/register").post(Register);
router.route("/login").post(Login)
router.route("/logout").get(LogOut)
router.route('/bookmark/:id').put(isAuthenticated, Bookmarks)
router.route("/profile/:id").get(isAuthenticated, getMyProfile)
router.route("/otheruser/:id").get(isAuthenticated, getOtherUser);
router.route('/follow/:id').post(isAuthenticated, follow);

export default router;