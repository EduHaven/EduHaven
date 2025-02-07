import express from "express";
import { login, logout, signup,getUserDetails,getFriends,addFriend,removeFriend,getUsers } from "../Controller/UserController.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/user/details", getUserDetails);
router.get("/user/:userId/friends", getFriends);
router.get("/user/:userId/users", getUsers);
router.post("/user/friend/add", addFriend);
router.post("/user/friend/remove", removeFriend);

export default router;
