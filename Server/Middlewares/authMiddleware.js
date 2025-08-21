import jwt from "jsonwebtoken";
import User from "../Model/UserModel.js";

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Unauthorized: No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', decoded);
    
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.log('User not found in database for ID:', decoded.id);
      return res.status(401).json({ success: false, error: 'Unauthorized: User not found.' });
    }
    
    req.user = user;
    console.log('User authenticated:', user._id);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized: Token expired" });
    }

    res
      .status(401)
      .json({ success: false, error: "Unauthorized: Invalid token" });
  }
};

export default authMiddleware;