import express from "express";
import { login, logout, signup,getUserDetails } from "../Controller/UserController.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/user/details", getUserDetails);

export default router;
