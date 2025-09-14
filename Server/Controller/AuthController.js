import bcrypt from "bcrypt";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

import Event from "../Model/EventModel.js";
import Note from "../Model/NoteModel.js";
import SessionRoom from "../Model/SessionModel.js";
import TimerSession from "../Model/StudySession.js";
import Task from "../Model/ToDoModel.js";
import User from "../Model/UserModel.js";

import generateAuthToken from "../utils/GenerateAuthToken.js";
import sendMail from "../utils/sendMail.js";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } =
  process.env;

// OAuth controllers
const googleAuth = (req, res) => {
  const scope =
    "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope,
    prompt: "select_account",
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
};

const googleCallback = async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("No code provided");

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const { id_token } = await tokenRes.json();
    if (!id_token) throw new Error("Token exchange failed");

    const payload = jwt.decode(id_token);
    const { sub: oauthId, email, given_name, family_name, picture } = payload;

    let user = await User.findOne({ Email: email });
    if (!user) {
      user = await User.create({
        FirstName: given_name,
        LastName: family_name,
        Email: email,
        ProfilePicture: picture,
        oauthProvider: "google",
        oauthId,
      });
    }

    const appToken = generateAuthToken(user);
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });

    res
      .cookie("token", appToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      })
      .redirect(
        `${process.env.CORS_ORIGIN}/auth/google/callback?token=${appToken}&refreshToken=${refreshToken}`
      );
  } catch (err) {
    console.error("Google OAuth error:", err);
    res.redirect(`${process.env.CORS_ORIGIN}/login?error=oauth_failed`);
  }
};

// normal auth controllers
const verifyUser = async (req, res) => {
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
      ProfilePicture: `https://api.dicebear.com/9.x/initials/svg?seed=${verify.user.FirstName}`,
    });

    return res.status(200).json({ message: "User Signup Successfully" });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }
    const user = await User.findOne({ Email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.Password.startsWith("$2")) {
      const match = await bcrypt.compare(Password, user.Password);
      if (!match) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      user.Password = await argon2.hash(Password, { type: argon2.argon2id });

      await user.save();
    } else {
      const match = await argon2.verify(user.Password, Password, {
        type: argon2.argon2id,
      });
      if (!match) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
    }

    const token = generateAuthToken(user);
    res.cookie("token", token, {
      expires: new Date(Date.now() + 86400000),
      httpOnly: true,
    });

    // refresh token expires in 7 days
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
    res.cookie("refreshToken", refreshToken, {
      expires: new Date(Date.now() + 86400000 * 7),
      httpOnly: true,
    });

    return res.status(200).json({
      message: "User Login Successfully",
      token,
      refreshToken,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const signup = async (req, res) => {
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
    const haspass = await argon2.hash(Password, { type: argon2.argon2id });

    // Create a temporary user object (not saved in the database yet)
    user = {
      FirstName,
      LastName,
      Email,
      Password: haspass, // Store hashed password
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

    await sendMail(Email, FirstName, otp, "signup");

    res.cookie("activationToken", activationToken, {
      expires: new Date(Date.now() + 86400000),
      httpOnly: true,
    });

    return res.status(201).json({
      message: "OTP sent to your email.",
      activationToken,
    });
  } catch (error) {
    console.error("Error during signup:", error);

    return res.status(500).json({ error: error.message });
  }
};

// Forgot Password - Send OTP
const forgotPassword = async (req, res) => {
  try {
    const { Email } = req.body;

    // Validate input
    if (!Email) {
      return res
        .status(422)
        .json({ error: "Please provide your email address" });
    }

    // Check if user exists
    const user = await User.findOne({ Email });
    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found with this email address" });
    }
    // check if user logged in with google

    if (user.oauthProvider === "google") {
      return res.status(403).json({
        error: "This account uses Google Sign-In and cannot change password.",
      });
    }
    // Generate OTP
    const otp = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");

    // Create reset token with user email and OTP
    const resetToken = jwt.sign(
      {
        email: Email,
        otp,
      },
      process.env.Activation_Secret,
      {
        expiresIn: "15m",
      }
    );

    // Send OTP via email
    await sendMail(Email, user.FirstName, otp, "reset");
    // Set cookie with reset token
    res.cookie("resetToken", resetToken, {
      expires: new Date(Date.now() + 900000), // 15 minutes
      httpOnly: true,
    });

    return res.status(200).json({
      message: "Password reset OTP sent to your email.",
      resetToken,
    });
  } catch (error) {
    console.error("Error during forgot password:", error);
    return res.status(500).json({ error: error.message });
  }
};

const verifyResetOTP = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(400).json({
        message: "Authorization header is required",
      });
    }

    const resetToken = authHeader.split(" ")[1];
    const { otp, email } = req.body;

    // Validate input
    if (!resetToken) {
      return res.status(400).json({
        message: "Reset token is required",
      });
    }

    if (!otp) {
      return res.status(422).json({
        error: "Please provide the OTP",
      });
    }

    // Verify reset token
    let verify;
    try {
      verify = jwt.verify(resetToken, process.env.Activation_Secret);
    } catch (error) {
      console.error("JWT verification error:", error.message);
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    // Verify OTP
    if (verify.otp.toString() !== otp.toString()) {
      return res.status(400).json({
        message: "Incorrect OTP",
      });
    }

    // Verify email matches
    if (verify.email !== email) {
      return res.status(400).json({
        message: "Email mismatch",
      });
    }

    // Create a verified token that can be used for password reset
    const verifiedResetToken = jwt.sign(
      {
        email: verify.email,
        otpVerified: true,
      },
      process.env.Activation_Secret,
      {
        expiresIn: "10m", // 10 minutes to reset password after OTP verification
      }
    );

    return res.status(200).json({
      message: "OTP verified successfully",
      verifiedResetToken,
    });
  } catch (error) {
    console.error("Error verifying reset OTP:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(400).json({
        message: "Authorization header is required",
      });
    }

    const resetToken = authHeader.split(" ")[1];
    const { newPassword } = req.body;

    // Validate input
    if (!resetToken) {
      return res.status(400).json({
        message: "Reset token is required",
      });
    }

    if (!newPassword) {
      return res.status(422).json({
        error: "Please provide new password",
      });
    }

    // Verify reset token
    let verify;
    try {
      verify = jwt.verify(resetToken, process.env.Activation_Secret);
    } catch (error) {
      console.error("JWT verification error:", error.message);
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    // Find user by email
    const user = await User.findOne({ Email: verify.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password
    await User.findByIdAndUpdate(user._id, { Password: hashedPassword });

    // Clear reset token cookie
    res.clearCookie("resetToken");

    return res.status(200).json({
      message:
        "Password reset successfully. Please login with your new password.",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.clearCookie("refreshToken");

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Logout failed" });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized request",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const newToken = generateAuthToken(user);
    return res.status(200).json({ success: true, token: newToken });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user._id;

    // Ensure deletion OTP was verified and still valid
    const currentUser = await User.findById(userId);
    if (!currentUser?.deletionOTP?.verified) {
      return res
        .status(403)
        .json({ error: "Deletion OTP not verified or missing" });
    }
    if (
      currentUser.deletionOTP.expiresAt &&
      currentUser.deletionOTP.expiresAt < new Date()
    ) {
      return res.status(403).json({ error: "Deletion OTP expired" });
    }

    // 1. Remove user from other users' friend lists
    await User.updateMany({ friends: userId }, { $pull: { friends: userId } });

    // 2. Delete all related data
    await User.updateMany(
      { friendRequests: userId },
      { $pull: { friendRequests: userId } }
    );
    await User.updateMany(
      { sentRequests: userId },
      { $pull: { sentRequests: userId } }
    );
    await User.updateMany(
      { kudosGiven: userId },
      { $pull: { kudosGiven: userId } }
    );

    await Note.updateMany(
      { "collaborators.user": userId },
      { $pull: { collaborators: { user: userId } } }
    );

    await Promise.all([
      Note.deleteMany({ owner: userId }),
      Event.deleteMany({ createdBy: userId }),
      TimerSession.deleteMany({ user: userId }),
      SessionRoom.deleteMany({ createdBy: userId }),
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

// Request deletion OTP (email)
const requestDeletionOTP = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const code = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    user.deletionOTP = { code, expiresAt, verified: false };
    await user.save();

    await sendMail(user.Email, user.FirstName, code, "reset"); // reuse reset template

    return res.status(200).json({ message: "Deletion OTP sent" });
  } catch (error) {
    console.error("Error requesting deletion OTP:", error);
    return res.status(500).json({ error: "Failed to send deletion OTP" });
  }
};

// Verify deletion OTP
const verifyDeletionOTP = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { otp } = req.body;
    if (!otp) return res.status(422).json({ error: "OTP required" });

    const user = await User.findById(req.user._id);
    if (!user?.deletionOTP?.code) {
      return res.status(400).json({ error: "No deletion OTP requested" });
    }
    if (user.deletionOTP.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }
    if (user.deletionOTP.code !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    user.deletionOTP.verified = true;
    await user.save();
    return res.status(200).json({ message: "Deletion OTP verified" });
  } catch (error) {
    console.error("Error verifying deletion OTP:", error);
    return res.status(500).json({ error: "Failed to verify deletion OTP" });
  }
};

export {
  deleteAccount,
  requestDeletionOTP,
  verifyDeletionOTP,
  googleAuth,
  googleCallback,
  login,
  forgotPassword,
  resetPassword,
  logout,
  refreshAccessToken,
  signup,
  verifyUser,
  verifyResetOTP,
};
