import express from "express";
import {
  deleteAccount,
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
} from "../Controller/AuthController.js";

// these are added -> for security --
import {
  signupValidationRules,
  loginValidationRules,
} from "../security/validation.js";
import { validate } from "../security/validationMiddleware.js";
import { sanitizeFields } from "../security/sanitizeMiddleware.js";
// ------

// Rate limiters
import {
  createLoginRateLimiter,
  createSignupRateLimiter,
} from "../Middlewares/ratelimit.middleware.js";

const loginRateLimiter = createLoginRateLimiter();
const signupRateLimiter = createSignupRateLimiter();

const router = express.Router();

// OAuth routes
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

// Normal auth routes
// router.post("/signup", signup);
router.post(
  "/signup",
  signupValidationRules(),
  validate,
  sanitizeFields(["FirstName", "LastName", "Email"]),
  signupRateLimiter,
  signup
);

router.post("/verify", verifyUser);

// router.post("/login", login);
router.post(
  "/login",
  loginValidationRules(),
  validate,
  sanitizeFields(["Email"]),
  loginRateLimiter,
  login
);

// Forgot password flow
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);

router.post("/logout", logout);
router.post("/refresh", refreshAccessToken);
router.post("/delete", deleteAccount);

export default router;
