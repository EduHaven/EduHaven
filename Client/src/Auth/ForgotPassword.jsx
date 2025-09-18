import axiosInstance from "@/utils/axios";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";

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

function ForgotPassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const url = "/auth/forgot-password";
      const response = await axiosInstance.post(url, { Email: data.Email });

      const { resetToken } = response.data;

      if (resetToken) {
        localStorage.setItem("resetToken", resetToken);
        localStorage.setItem("resetEmail", data.Email);
        toast.success("OTP sent to your email successfully!");
        navigate("/auth/verify-reset-otp");
      }
    } catch (error) {
      console.error(
        "Forgot password failed:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.error || "Failed to send OTP. Please try again."
      );
    }
  };

  const goSignIn = () => {
    navigate("/auth/login");
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="relative w-full max-w-md rounded-3xl"
    >
      <div className="relative z-10">
        <motion.div
          variants={formVariants}
          initial="initial"
          animate="animate"
          className="space-y-6"
        >
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Forgot Password?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Enter your email address and we will send you an OTP to reset your
              password
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("Email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                className="block w-full rounded-xl bg-transparent border border-gray-400 px-3 py-2 text-gray-900 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
              />
              {errors.Email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              variant="default"
              className={`w-full rounded-xl py-3 px-4 font-semibold flex items-center justify-center gap-2 ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              }`}
            >
              {isSubmitting ? (
                "Sending OTP..."
              ) : (
                <>
                  <Send size={18} />
                  Send Reset OTP
                </>
              )}
            </Button>
          </form>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{" "}
              <Button
                onClick={goSignIn}
                variant="link"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in
              </Button>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ForgotPassword;
