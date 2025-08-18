import User from "../Model/UserModel.js";
import bcrypt from "bcrypt";
import generateAuthToken from "../utils/GenerateAuthToken.js";
import cloudinary from "cloudinary";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail.js";
import Event from "../Model/EventModel.js";
import Note from "../Model/NoteModel.js";
import TimerSession from "../Model/StudySession.js";
import SessionRoom from "../Model/SessionModel.js";
import Task from "../Model/ToDoModel.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dmehndmws",
  api_key: process.env.CLOUDINARY_API_KEY || "772976768998728",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "BXpWyZHYKbAexc3conUG88t6TVM",
});

export const signup = async (req, res) => {
  try {
    const { FirstName, LastName, Email, Password } = req.body;

    // Validate input fields
    if (!FirstName || !LastName || !Email || !Password) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }

    // Check if user already exists
    let user = await User.findOne({ Email: Email });
    if (user) {
      return res.status(409).json({ error: "User already exists" });
    }
    // const imageurl = req.body.imageUrl;
    // console.log(imageurl)
    // Hash the password
    const haspass = await bcrypt.hash(Password, 12);

    // Create a temporary user object (not saved in the database yet)
    user = {
      FirstName,
      LastName,
      Email,
      Password: haspass, // Store hashed password
      ProfilePicture: "https://cdn-icons-png.flaticon.com/512/219/219986.png", // Default profile picture
    };

    const otp = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
    const activationToken = jwt.sign(
      {
        user,
        otp,
      },
      process.env.Activation_Secret,
      {
        expiresIn: "1d",
      }
    );

    await sendMail(Email, FirstName, otp);

    const token = generateAuthToken(user);

    res.cookie("activationToken", activationToken, {
      expires: new Date(Date.now() + 86400000),
      httpOnly: true,
    });

    return res.status(201).json({
      message: "OTP sent to your email.",
      token,
      activationToken,
    });
  } catch (error) {
    console.error("Error during signup:", error);

    return res.status(500).json({ error: error.message });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(400).json({
        message: "Authorization header is required",
      });
    }

    const activationToken = authHeader.split(" ")[1];
    const { otp } = req.body;
    if (!activationToken) {
      return res.status(400).json({
        message: "Activation token is required",
      });
    }

    let verify;
    try {
      verify = jwt.verify(activationToken, process.env.Activation_Secret);
    } catch (error) {
      console.error("JWT verification error:", error.message);
      return res.status(400).json({
        message: "Invalid or expired activation token",
      });
    }

    if (verify.otp.toString() !== otp.toString()) {
      return res.status(400).json({
        message: "Incorrect OTP",
      });
    }

    await User.create({
      FirstName: verify.user.FirstName,
      LastName: verify.user.LastName,
      Email: verify.user.Email,
      Password: verify.user.Password,
    });

    return res.status(200).json({ message: "User Signup Successfully" });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user._id;
    const updateData = req.body;

    const forbiddenFields = ["_id", "Email", "Password"];
    forbiddenFields.forEach((field) => {
      if (updateData[field]) {
        delete updateData[field];
      }
    });

    if (updateData.GraduationYear) {
      const currentYear = new Date().getFullYear();
      if (
        updateData.GraduationYear < 1900 ||
        updateData.GraduationYear > currentYear + 10
      ) {
        return res.status(400).json({ error: "Invalid graduation year" });
      }
    }

    if (updateData.Bio && updateData.Bio.length > 500) {
      return res
        .status(400)
        .json({ error: "Bio cannot exceed 500 characters" });
    }

    if (updateData.OtherDetails) {
      if (typeof updateData.OtherDetails !== "object") {
        return res
          .status(400)
          .json({ error: "OtherDetails must be an object" });
      }
      const MAX_DETAILS_LENGTH = 1000;
      Object.entries(updateData.OtherDetails).forEach(([key, value]) => {
        if (typeof value === "string" && value.length > MAX_DETAILS_LENGTH) {
          return res.status(400).json({
            error: `${key} in OtherDetails cannot exceed ${MAX_DETAILS_LENGTH} characters`,
          });
        }
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    ).select("-Password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Profile update error:", error);
    return res
      .status(500)
      .json({ error: "Failed to update profile", details: error.message });
  }
};

// controllers/userController.js

export const deleteAccount = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user._id;

    // 1. Remove user from other users' friend lists
    await User.updateMany({ friends: userId }, { $pull: { friends: userId } });

    // 2. Delete all related data
    await Promise.all([
      Note.deleteMany({ user: userId }),
      Event.deleteMany({ createdBy: userId }),
      TimerSession.deleteMany({ userId }),
      SessionRoom.deleteMany({ host: userId }),
      Task.deleteMany({ user: userId }),
    ]);

    // 3. Delete user account
    await User.findByIdAndDelete(userId);

    return res
      .status(200)
      .json({ message: "Account and related data deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({ error: "Failed to delete account" });
  }
};

export const login = async (req, res) => {
  try {
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

    const token = generateAuthToken(user);
    res.cookie("token", token, {
      expires: new Date(Date.now() + 86400000),
      httpOnly: true,
    });

    return res
      .status(200)
      .json({ message: "User Login Successfully", token, user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Logout failed" });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.query.id;

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

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_pictures",
      transformation: [
        { width: 500, height: 500, crop: "limit" }, // Resize and limit image size
        { quality: "auto" }, // Optimize image quality
      ],
    });

    // Update user's profile picture URL
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { ProfilePicture: result.secure_url },
      { new: true }
    ).select("-Password");

    return res.status(200).json({
      message: "Profile picture uploaded successfully",
      profilePictureUrl: result.secure_url,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile picture upload error:", error);
    return res.status(500).json({
      error: "Failed to upload profile picture",
      details: error.message,
    });
  }
};
