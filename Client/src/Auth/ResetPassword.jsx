import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import axiosInstance from "@/utils/axios";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  KeyRound,
} from "lucide-react";
import { toast } from "react-toastify";
import bgImg from "../assets/LoginBackground.jpg";
import { Button } from "@/components/ui/button"

// const backendUrl = import.meta.env.VITE_API_URL;

const formVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const containerVariants = {
  initial: {
    scale: 0.9,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const backgroundVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 1 },
  },
};

function ResetPassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetComplete, setIsResetComplete] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm();

  useEffect(() => {
    // Get email from localStorage
    const email = localStorage.getItem("resetEmail");
    const resetToken = localStorage.getItem("resetToken");
    const otpVerified = localStorage.getItem("otpVerified");
    if (email) {
      setResetEmail(email);
    } else {
      // If no email found, redirect to forgot password
      toast.error("Please start the password reset process again.");
      navigate("/auth/forgot-password");
    }
  }, [navigate]);

  const password = watch("newPassword", "");
  const confirmPassword = watch("confirmPassword", "");
  const [strength, setStrength] = useState(0);

  const strengthLevels = [
    { level: "Very Weak", color: "text-red-500" },
    { level: "Weak", color: "text-orange-500" },
    { level: "Medium", color: "text-yellow-500" },
    { level: "Strong", color: "text-green-500" },
    { level: "Very Strong", color: "text-emerald-600" },
  ];

  const passwordEdgeCases = (pwd) => {
    let score = 0;
    if (pwd.trim().length >= 6) score++;
    if (/\d/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++;
    return score;
  };

  useEffect(() => {
    setStrength(passwordEdgeCases(password));
  }, [password]);

  const onSubmit = async (data) => {
    // Check if passwords match
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const resetToken = localStorage.getItem("resetToken");
      if (!resetToken) {
        toast.error("Reset token not found. Please start the process again.");
        navigate("/auth/forgot-password");
        return;
      }

      const url = `/auth/reset-password`;
      const response = await axiosInstance.post(
        url,
        {
          email: resetEmail,
          newPassword: data.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${resetToken}`,
          },
        }
      );

      // Clear stored data
      localStorage.removeItem("resetToken");
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("otpVerified");
      reset();
      setIsResetComplete(true);
      toast.success("Password reset successful!");

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/auth/login");
      }, 3000);
    } catch (error) {
      console.error(
        "Reset password failed:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to reset password"
      );
    }
  };

  if (isResetComplete) {
    return (
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="relative w-full max-w-md rounded-3xl"
      >
        <div className="relative z-10 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Password Reset Complete!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your password has been successfully reset. You can now login with
            your new password.
          </p>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-700 dark:text-green-300">
              Redirecting to login page in a few seconds...
            </p>
          </div>
          <Button
            onClick={() => navigate("/auth/login")}
            variant="default"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Go to Login Now
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="relative w-full max-w-md rounded-3xl"
    >
      <motion.div
        variants={formVariants}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
            <KeyRound className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Reset Your Password
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              New Password{" "}
              <span
                className={`text-sm ml-20 font-semibold ${strengthLevels[strength - 1]?.color
                  }`}
              >
                {strengthLevels[strength - 1]?.level}
              </span>
            </label>
            <div className="mt-2.5 relative">
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="block w-full rounded-xl bg-transparent border border-gray-400 px-3 py-2 text-gray-900 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-blue-600"
              >
                {showPassword ? <Eye size={19} /> : <EyeOff size={19} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className="block w-full rounded-xl bg-transparent border border-gray-400 px-3 py-2 text-gray-900 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-blue-600"
              >
                {showConfirmPassword ? <Eye size={19} /> : <EyeOff size={19} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
            {confirmPassword && confirmPassword === password && (
              <p className="text-green-500 text-sm mt-1 flex items-center gap-1">
                <CheckCircle size={16} />
                Passwords match
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            variant="default"
            className={`w-full rounded-xl py-3 px-4 font-semibold ${isSubmitting
              ? "opacity-50 cursor-not-allowed bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              }`}
          >
            {isSubmitting ? "Resetting Password..." : "Reset Password"}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default ResetPassword;
