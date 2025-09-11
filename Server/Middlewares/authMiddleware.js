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

    // console.log('Decoded JWT:', decoded);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized: User not found" });
    }

    next();
  } catch (error) {
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
