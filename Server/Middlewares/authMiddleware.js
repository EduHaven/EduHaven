import jwt from 'jsonwebtoken';
import User from '../Model/UserModel.js';

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log("🛡️  Incoming token:", token);

  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ success: false, error: 'Unauthorized: No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ JWT decoded:", decoded);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.log("❌ User not found for decoded ID:", decoded.id);
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    req.user = {
      ...user.toObject(),
      id: user._id.toString(),
    };

    console.log("✅ Authenticated user:", req.user.id);
    next();
  } catch (error) {
    console.error("❌ Token error:", error.message);
    res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
  }
};

export default authMiddleware;
