import User from "../Model/UserModel.js";
import bcrypt from "bcrypt";
import generateAuthToken from "../utils/GenerateAuthToken.js";
import mongoose from "mongoose";
import TryCatch from "../utils/TryCatch.js";

export const signup = TryCatch(async (req, res) => {
  const { FullName, Email, Password } = req.body;
  if (!FullName || !Email || !Password) {
    return res.status(422).json({ error: "Please fill all the fields" });
  }
  const userExists = await User.findOne({ Email: Email });
  if (userExists) {
    return res.status(409).json({ error: "User already exists" });
  }
  const haspass = await bcrypt.hash(Password, 12);
  const user = new User({
    FullName,
    Email,
    Password: haspass,
    UserProfile: "https://cdn-icons-png.flaticon.com/512/219/219986.png",
  });
  await user.save();
  const token = generateAuthToken(user._id);
  res.cookie("token", token, {
    expires: new Date(Date.now() + 86400000),
  });
  return res.status(201).json({ token, user });
});

export const login = TryCatch(async (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res.status(422).json({ error: "Please fill all the fields" });
  }
  const user = await User.findOne({ Email });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const isMatch = await bcrypt.compare(Password, user.Password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Generate the token with userId and FullName
  const token = generateAuthToken(user._id, user.FullName);
  res.cookie("token", token, {
    expires: new Date(Date.now() + 86400000),
    httpOnly: true, // Prevents client-side access
  });

  return res
    .status(200)
    .json({ message: "User Login Successfully", token, user });
});

export const logout = TryCatch(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Secure cookies in production
    sameSite: "strict",
  });

  // Send success response
  return res.status(200).json({ message: "User logged out successfully" });
});

export const getUserDetails = TryCatch(async (req, res) => {
  const userId = req.parms;
  console.log(userId);

  if (!userId || userId === "undefined") {
    return res
      .status(400)
      .json({ error: "User ID is required and cannot be undefined" });
  }
  const user = await User.findById(userId).select("-Password");

  if (!user) {
    console.log("User not found");
    return res.status(404).json({ error: "User not found" });
  }

  console.log("User details found:", user); // Log user details only if found
  return res.status(200).json(user);
});
