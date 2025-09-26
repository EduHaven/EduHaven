import multer from "multer";
import fs from "fs-extra";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Configuration for Local Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads"); // Local directory
    fs.ensureDirSync(uploadPath); // Ensure folder exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});

const uploadmanish = multer({ storage });

// Middleware to Handle Cloudinary Upload and Local Folder Cleanup
const cloudinaryUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "signup_images", // Cloudinary folder for signup images
    });

    // console.log('Cloudinary upload result:', result);

    // Attach Cloudinary details to the request body
    req.body.imageUrl = result.secure_url;
    req.body.publicId = result.public_id;

    // Clean up the local 'uploads' folder
    const uploadPath = path.join(process.cwd(), "uploads");
    await fs.emptyDir(uploadPath); // Remove all files from the folder

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error during Cloudinary upload:", error);

    // Cleanup the local file in case of error
    if (req.file && req.file.path) {
      await fs.remove(req.file.path);
    }

    res.status(500).json({
      message: "File upload to Cloudinary failed!",
      error: error.message,
    });
  }
};
const removefromCloudinary=async(publicid,resource_type)=>{        
      try {         
        await cloudinary.uploader.destroy("eduhaven-notes/"+publicid,{resource_type:resource_type})
      } catch (error) {
        throw ApiError(500,{},"Error in deleting the cloudeinary file")
      }
    }

export { uploadmanish, cloudinaryUpload, removefromCloudinary };

