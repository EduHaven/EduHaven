import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "@/utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const backendUrl = import.meta.env.VITE_API_URL;

function SignUp() {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = `${backendUrl}/auth/google`;
  };

  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Form submitted:", data);
    try {
      const url = `/auth/signup`;
      if (!data.FirstName || !data.LastName) {
        throw new Error("First Name and Last Name are required");
      }

      const response = await axiosInstance.post(url, data);

      reset();

      const { activationToken } = response.data;

      if (activationToken) {
        localStorage.setItem("activationToken", activationToken);
        navigate("/auth/verify");
      } else {
        toast.success(
          "Account created successfully! Please login to continue."
        );
        navigate("/auth/login");
      }
    } catch (error) {
      console.error(`Signup failed:`, error.response?.data || error.message);
      toast.error(error.response?.data?.error || "An error occurred");
    }
  };

  const password = watch("Password", "");
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create Account
        </h2>
      </div>

      <Button
        onClick={handleGoogleLogin}
        variant="transparent" // You can create a custom "google" variant if you prefer
        className="flex items-center justify-center gap-2 border border-gray-400 rounded-xl text-black dark:text-white font-semibold p-2 text-lg w-full"
      >
        <img src="/GoogleIcon.svg" alt="Google sign-in" className="size-6" />
        <p>Continue with Google</p>
      </Button>
      {/* or */}
      <div className="flex items-center my-6">
        <div className="flex-grow h-px bg-gray-300"></div>
        <span className="mx-4 text-gray-500 font-medium text-sm">OR</span>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Email
          </label>
          <div className="mt-2.5">
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
              className="block w-full rounded-xl bg-transparent border border-gray-400 px-3 py-2 text-gray-900 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
            />
            {errors.Email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.Email.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              First Name
            </label>
            <div className="mt-2.5">
              <input
                id="first-name"
                type="text"
                placeholder="John"
                {...register("FirstName", {
                  required: "First Name is required",
                })}
                className="block w-full rounded-xl border bg-transparent border-gray-400 px-3 py-2 text-gray-900 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
              />
              {errors.FirstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.FirstName.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-1/2">
            <label
              htmlFor="last-name"
              className="block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Last Name
            </label>
            <div className="mt-2">
              <input
                id="last-name"
                type="text"
                placeholder="Doe"
                {...register("LastName", {
                  required: "Last Name is required",
                })}
                className="block w-full rounded-xl border bg-transparent border-gray-400 px-3 py-2 text-gray-900 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
              />
              {errors.LastName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.LastName.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Password{" "}
            <span
              className={`text-sm ml-52 font-semibold ${
                strengthLevels[strength - 1]?.color
              }`}
            >
              {strengthLevels[strength - 1]?.level}
            </span>
          </label>

          <div className="mt-2.5 relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              {...register("Password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="block w-full rounded-lg bg-transparent border border-gray-400 px-3 py-2 text-gray-900 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-indigo-600"
            >
              {showPassword ? <Eye size={19} /> : <EyeOff size={19} />}
            </button>

            {errors.Password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.Password.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="default"
            className={`w-full rounded-md py-2 px-4 font-semibold ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed bg-gray-400"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Create account"}
          </Button>
        </div>
      </form>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-6 text-center"
      >
        <Link
          className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
          to="/auth/login"
        >
          Already have an account? Sign in
        </Link>
      </motion.div>
    </div>
  );
}

export default SignUp;
