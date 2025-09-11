import express from "express";
import {
  login,
  logout,
  signup,
  getUserDetails,
  updateProfile,
  uploadProfilePicture,
  verifyUser,
  deleteAccount,
  getUserBadges,
  giveKudos,
  refreshAccessToken,
} from "../Controller/UserController.js";
import authMiddleware from "../Middlewares/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { cloudinaryUpload, uploadmanish } from "../utils/Cloudnary.js";

const router = express.Router();

// Configure Multer for file upload
const uploadDir = "uploads/";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
      );
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/tiff",
      "image/webp",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images are allowed."), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});

// uploadmanish.single("image"),cloudinaryUpload

router.post("/signup", signup);
router.post("/verify", verifyUser);
router.post("/login", login);
router.post("/logout", logout);
router.post("/auth/refresh", refreshAccessToken);

router.post("/kudos", authMiddleware, giveKudos);
router.get("/user/details", getUserDetails);
router.get("/user/badges", authMiddleware, getUserBadges);
router.delete("/user/delete", authMiddleware, deleteAccount);
router.put("/user/profile", authMiddleware, updateProfile);
router.post(
  "/user/upload-profile-picture",
  authMiddleware,
  upload.single("profilePicture"),
  uploadProfilePicture
);

export default router;
