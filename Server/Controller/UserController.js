import cloudinary from "cloudinary";
import jwt from "jsonwebtoken";
import User from "../Model/UserModel.js";
import {
  BADGES,
  checkAllBadges,
  checkAndAwardRookieBadge,
} from "../utils/badgeSystem.js";

// =====================
// Utility Functions
// =====================
const sendError = (res, status, message, details = null) => {
  const errorResponse = { error: message };
  if (details) errorResponse.details = details;
  return res.status(status).json(errorResponse);
};

const validateGraduationYear = (year) => {
  const currentYear = new Date().getFullYear();
  return year >= 1900 && year <= currentYear + 10;
};

const validateBio = (bio) => bio.length <= 500;

const validateOtherDetails = (details) => {
  if (typeof details !== "object") return false;
  const MAX_DETAILS_LENGTH = 1000;
  return Object.entries(details).every(
    ([, value]) =>
      !(typeof value === "string" && value.length > MAX_DETAILS_LENGTH)
  );
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dmehndmws",
  api_key: process.env.CLOUDINARY_API_KEY || "772976768998728",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "BXpWyZHYKbAexc3conUG88t6TVM",
});

// =====================
// Controllers
// =====================

const updateProfile = async (req, res) => {
  try {
    if (!req.user) return sendError(res, 401, "Unauthorized");

    const userId = req.user._id;
    const updateData = { ...req.body };

    // Remove forbidden fields
    ["_id", "Email", "Password"].forEach((field) => delete updateData[field]);

    // Validations
    if (
      updateData.GraduationYear &&
      !validateGraduationYear(updateData.GraduationYear)
    ) {
      return sendError(res, 400, "Invalid graduation year");
    }
    if (updateData.Bio && !validateBio(updateData.Bio)) {
      return sendError(res, 400, "Bio cannot exceed 500 characters");
    }
    if (
      updateData.OtherDetails &&
      !validateOtherDetails(updateData.OtherDetails)
    ) {
      return sendError(
        res,
        400,
        "Invalid OtherDetails format or length exceeded"
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-Password");

    if (!updatedUser) return sendError(res, 404, "User not found");

    // Award Rookie Badge if applicable
    try {
      const badgeResult = await checkAndAwardRookieBadge(userId);
      if (badgeResult.success) {
        const userWithBadge = await User.findById(userId).select("-Password");
        return res.status(200).json(userWithBadge);
      }
    } catch (err) {
      console.error("Badge awarding failed:", err.message);
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Profile update error:", error);
    return sendError(res, 500, "Failed to update profile", error.message);
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userId = req.query.id;
    if (!userId || userId === "undefined") {
      return sendError(res, 400, "User ID is required and cannot be undefined");
    }

    const user = await User.findById(userId).select("-Password").lean();
    if (!user) return sendError(res, 404, "User not found");

    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res
        .status(200)
        .json({ ...user, relationshipStatus: "Add friends" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res
        .status(200)
        .json({ ...user, relationshipStatus: "Add friends" });
    }

    const currUser = await User.findById(decoded.id).select(
      "friends friendRequests sentRequests"
    );
    if (!currUser)
      return res.status(200).json({ ...user, relationshipStatus: "unknown" });

    let relationshipStatus = "Add Friend";
    if (currUser.friends.includes(userId)) relationshipStatus = "Friends";
    else if (currUser.sentRequests.includes(userId))
      relationshipStatus = "Cancel Request";
    else if (currUser.friendRequests.includes(userId))
      relationshipStatus = "Accept Request";

    return res.status(200).json({ ...user, relationshipStatus });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return sendError(res, 500, "Failed to fetch user details", error.message);
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.user) return sendError(res, 401, "Unauthorized");
    if (!req.file) return sendError(res, 400, "No image uploaded");

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_pictures",
      transformation: [
        { width: 500, height: 500, crop: "limit" },
        { quality: "auto" },
      ],
    });

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
    return sendError(
      res,
      500,
      "Failed to upload profile picture",
      error.message
    );
  }
};

const getUserBadges = async (req, res) => {
  try {
    if (!req.user) return sendError(res, 401, "Unauthorized");

    const userId = req.user._id;
    const user = await User.findById(userId).select("badges");
    if (!user) return sendError(res, 404, "User not found");

    try {
      const newBadges = await checkAllBadges(userId);
      if (newBadges.length > 0) {
        const updatedUser = await User.findById(userId).select("badges");
        return res.status(200).json({
          badges: updatedUser.badges || [],
          newBadges,
          availableBadges: Object.values(BADGES),
        });
      }
    } catch (err) {
      console.error("Badge check failed:", err.message);
    }

    return res.status(200).json({
      badges: user.badges || [],
      newBadges: [],
      availableBadges: Object.values(BADGES),
    });
  } catch (error) {
    console.error("Get badges error:", error);
    return sendError(res, 500, "Failed to get badges", error.message);
  }
};

const giveKudos = async (req, res) => {
  try {
    const giverId = req.user.id;
    const { receiverId } = req.body;

    if (giverId === receiverId) {
      return sendError(res, 400, "You cannot give kudos to yourself.");
    }

    const giver = await User.findById(giverId);
    const receiver = await User.findById(receiverId);

    if (!receiver) return sendError(res, 404, "Receiver not found.");
    if (giver.kudosGiven.includes(receiverId)) {
      return sendError(res, 400, "You have already given kudos to this user.");
    }

    giver.kudosGiven.push(receiverId);
    receiver.kudosReceived = (receiver.kudosReceived || 0) + 1;

    await giver.save();
    await receiver.save();

    return res.status(200).json({
      message: "Kudos given successfully!",
      receiverKudos: receiver.kudosReceived,
    });
  } catch (error) {
    console.error("Give kudos error:", error);
    return sendError(res, 500, "Server error", error.message);
  }
};

export {
  getUserBadges,
  getUserDetails,
  giveKudos,
  updateProfile,
  uploadProfilePicture,
};
