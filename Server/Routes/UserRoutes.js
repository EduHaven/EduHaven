import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import {
  getUserBadges,
  getUserDetails,
  giveKudos,
  updateProfile,
  uploadProfilePicture,
  findUserByUsernameOrEmail,
  checkUsernameExists,
} from "../Controller/UserController.js";

// these are added -> for security --
import { updateProfileValidationRules } from "../security/validation.js";
import { validate } from "../security/validationMiddleware.js";
import { sanitizeFields } from "../security/sanitizeMiddleware.js";
//

import authMiddleware from "../Middlewares/authMiddleware.js";

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

router.post("/kudos", authMiddleware, giveKudos);
router.get("/details", getUserDetails);
router.get("/badges", authMiddleware, getUserBadges);

// router.put("/profile", authMiddleware, updateProfile);
router.put(
  "/profile",
  authMiddleware,
  updateProfileValidationRules(),
  validate,
  sanitizeFields(["Bio"]),
  updateProfile
);

router.post(
  "/upload-profile-picture",
  authMiddleware,
  upload.single("profilePicture"),
  uploadProfilePicture
);

router.get("/find-user", findUserByUsernameOrEmail);
router.get("/check-username", checkUsernameExists);

export default router;
