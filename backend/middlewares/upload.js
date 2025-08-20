import multer from 'multer';


const storage = multer.diskStorage({
  destination: "backend/uploads", // The folder where images will be stored
  filename: (req, file, cb) => {
    // Create a unique filename 
    return cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

export default upload;
