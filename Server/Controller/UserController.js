import cloudinary from "cloudinary";
import jwt from "jsonwebtoken";
import User from "../Model/UserModel.js";
import {
  BADGES,
  checkAllBadges,
  checkAndAwardRookieBadge,
} from "../utils/badgeSystem.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dmehndmws",
  api_key: process.env.CLOUDINARY_API_KEY || "772976768998728",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "BXpWyZHYKbAexc3conUG88t6TVM",
});

const updateProfile = async (req, res) => {
  try {
    console.log("updateProfile called");
    console.log(
      "req.user:",
      req.user ? { id: req.user._id, name: req.user.FirstName } : "No user"
    );
    console.log("Request body:", req.body);

    if (!req.user) {
      console.log("No user in request - auth middleware failed");
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

    // Check and award Rookie badge if profile is complete
    try {
      console.log("Profile updated, checking for Rookie badge...");
      const badgeResult = await checkAndAwardRookieBadge(userId);
      console.log("Badge check result:", badgeResult);

      if (badgeResult.success) {
        console.log(`Rookie badge awarded to user ${userId}`);
        // Re-fetch user to include the new badge
        const userWithBadge = await User.findById(userId).select("-Password");
        return res.status(200).json(userWithBadge);
      }
    } catch (badgeError) {
      console.error("Error checking Rookie badge:", badgeError);
      // Continue even if badge check fails
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Profile update error:", error);
    return res
      .status(500)
      .json({ error: "Failed to update profile", details: error.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userId = req.query.id;
    if (!userId || userId === "undefined") {
      return res
        .status(400)
        .json({ error: "User ID is required and cannot be undefined" });
    }

    const user = await User.findById(userId).select("-Password").lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res
        .status(200)
        .json({ ...user, relationshipStatus: "Add friends" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res
        .status(200)
        .json({ ...user, relationshipStatus: "Add friends" });
    }

    const currUser = await User.findById(decoded.id).select(
      "friends friendRequests sentRequests"
    );

    if (!currUser) {
      return res.status(200).json({ ...user, relationshipStatus: "unknown" });
    }

    // Determine relationship from here
    let relationshipStatus = "Add Friend";

    if (currUser.friends.includes(userId)) {
      relationshipStatus = "Friends";
    } else if (currUser.sentRequests.includes(userId)) {
      relationshipStatus = "Cancel Request";
    } else if (currUser.friendRequests.includes(userId)) {
      relationshipStatus = "Accept Request";
    }

    return res.status(200).json({ ...user, relationshipStatus });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
};

const uploadProfilePicture = async (req, res) => {
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

// Get user badges
const getUserBadges = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user._id;
    console.log("Getting badges for user:", userId);

    const user = await User.findById(userId).select("badges");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Current user badges:", user.badges);

    // Check for any newly earned badges
    try {
      console.log("Checking for new badges...");
      const newBadges = await checkAllBadges(userId);
      console.log("New badges found:", newBadges);

      if (newBadges.length > 0) {
        // Re-fetch user to get updated badges
        const updatedUser = await User.findById(userId).select("badges");
        console.log("Updated user badges after awarding:", updatedUser.badges);

        return res.status(200).json({
          badges: updatedUser.badges || [],
          newBadges: newBadges,
          availableBadges: Object.values(BADGES),
        });
      }
    } catch (badgeError) {
      console.error("Error checking badges:", badgeError);
      // Continue with existing badges if check fails
    }

    return res.status(200).json({
      badges: user.badges || [],
      newBadges: [],
      availableBadges: Object.values(BADGES),
    });
  } catch (error) {
    console.error("Get badges error:", error);
    return res.status(500).json({
      error: "Failed to get badges",
      details: error.message,
    });
  }
};

const giveKudos = async (req, res) => {
  try {
    const giverId = req.user.id;
    const { receiverId } = req.body;

    if (giverId === receiverId) {
      return res
        .status(400)
        .json({ message: "You cannot give kudos to yourself." });
    }

    const giver = await User.findById(giverId);
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    if (giver.kudosGiven.includes(receiverId)) {
      return res
        .status(400)
        .json({ message: "You have already given kudos to this user." });
    }

    giver.kudosGiven.push(receiverId);
    receiver.kudosReceived = (receiver.kudosReceived || 0) + 1;

    await giver.save();
    await receiver.save();

    res.status(200).json({
      message: "Kudos given successfully!",
      receiverKudos: receiver.kudosReceived,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getUserBadges,
  getUserDetails,
  giveKudos,
  updateProfile,
  uploadProfilePicture,
};
