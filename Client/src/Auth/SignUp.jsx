import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axiosInstance from "@/utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const backendUrl = import.meta.env.VITE_API_URL;

function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  // --- Validation Functions ---
  const validateEmail = (value) => {
    if (!value) return "Email is required";
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value) ? true : "Enter a valid email address";
  };

  const validateName = (value, fieldName) => {
    if (!value) return `${fieldName} is required`;
    if (!/^[A-Za-z]*$/.test(value)) return "Please input only letters";
    if (value.length < 2) return "Please enter at least 2 letters";
    if (value.length > 12) return "Character limit exceeds";
  };

  const validateUsername = async (value) => {
    if (!value) return "Username is required";
    if (!/^[A-Za-z0-9_]*$/.test(value))
      return "Username can only contain letters, numbers, and underscores";
    if (value.length < 3) return "Username must be at least 3 characters long";

    // Check for Username Exist or not?
    try {
      setIsCheckingUsername(true);
      const response = await axiosInstance.get(
        `/user/check-username?username=${value}`
      );
      if (response.data.exists) {
        return "This username is already taken";
      }
    } catch (error) {
      console.error("Error validating username:", error);
      return "Could not validate username, try again";
    } finally {
      setIsCheckingUsername(false); // stop loader
    }

    return true;
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return true;
  };

  // --- Password Strength Function ---
  const passwordEdgeCases = (pwd) => {
    let score = 0;
    if (pwd.trim().length >= 6) score++;
    if (/\d/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++;
    return score;
  };

  // --- Password Strength Logic ---
  const strengthLevels = [
    { level: "Very Weak", color: "text-red-600" },
    { level: "Weak", color: "text-orange-500" },
    { level: "Medium", color: "text-yellow-500" },
    { level: "Strong", color: "text-green-500" },
    { level: "Very Strong", color: "text-emerald-600" },
  ];

  // --- Single useForm call with everything you need ---
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setError,
    setValue,
    control,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const password = watch("Password", "");
  const username = watch("Username", "");

  useEffect(() => {
    if (username) {
      // User is typing
      setIsCheckingUsername(true);

      if (typingTimeout) clearTimeout(typingTimeout);

      const timeout = setTimeout(() => {
        setIsCheckingUsername(false); // stop loader after 500ms of inactivity
      }, 500);

      setTypingTimeout(timeout);
    } else {
      setIsCheckingUsername(false);
    }

    return () => typingTimeout && clearTimeout(typingTimeout);
  }, [username]);

  useEffect(() => {
    setStrength(passwordEdgeCases(password));
  }, [password]);

  // --- Google Login ---
  const handleGoogleLogin = () => {
    window.location.href = `${backendUrl}/auth/google`;
  };

  // --- Form Submit ---
  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post(`/auth/signup`, data);
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
      const errMsg = error.response?.data?.error || error.message;
      if (errMsg.toLowerCase().includes("username")) {
        setError("Username", {
          type: "manual",
          message: "Username already exists. Please choose another.",
        });
      } else if (errMsg.toLowerCase().includes("email")) {
        setError("Email", {
          type: "manual",
          message: "Email already exists. Please use another.",
        });
      } else {
        toast.error(errMsg);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create Account
        </h2>
      </div>

      {/* Google Login */}
      <Button
        onClick={handleGoogleLogin}
        variant="transparent" // You can create a custom "google" variant if you prefer
        className="flex items-center justify-center gap-2 border border-gray-400 rounded-xl text-black dark:text-white hover:bg-white hover:dark:bg-black font-semibold p-2 text-lg w-full"
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
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Email
          </label>
          <div className="mt-2.5 relative">
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("Email", { validate: validateEmail })}
              className="block w-full rounded-xl bg-transparent border border-gray-400 px-3 py-2 text-gray-900 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
            />

            {/*Show Email Validation */}
            {errors.Email && (
              <p className="absolute left-0 top-full text-red-600 text-sm mt-0.5">
                {errors.Email.message}
              </p>
            )}
          </div>
        </div>

        {/* First & Last Name */}
        <div className="flex gap-4">
          {/* First Name */}
          <div className="w-1/2">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              First Name
            </label>

            <div className="mt-2.5 relative">
              <Controller
                name="FirstName"
                control={control}
                rules={{
                  validate: (v) => validateName(v, "First Name"),
                }}
                render={({ field }) => (
                  <>
                    <input
                      id="first-name"
                      type="text"
                      placeholder="John"
                      maxLength={12}
                      {...field}
                      className="block w-full rounded-xl border bg-transparent border-gray-400 px-3 py-2 text-gray-900 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                    />

                    {/*Show Character Remaining*/}
                    <span
                      className={`absolute top-2 right-2 text-sm ${
                        field.value?.length === 12
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {12 - (field.value ? field.value.length : 0)}
                    </span>

                    {/*Show FirstName Validation */}
                    {errors.FirstName && (
                      <p className="absolute left-0 top-full text-red-600 text-sm mt-0.5">
                        {errors.FirstName.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="w-1/2">
            <label
              htmlFor="last-name"
              className="block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Last Name
            </label>
            <div className="mt-2.5 relative">
              <Controller
                name="LastName"
                control={control}
                rules={{
                  validate: (v) => validateName(v, "Last Name"),
                }}
                render={({ field }) => (
                  <>
                    <input
                      id="last-name"
                      type="text"
                      placeholder="Doe"
                      maxLength={12}
                      {...field}
                      className="block w-full rounded-xl border bg-transparent border-gray-400 px-3 py-2 text-gray-900 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                    />

                    {/*Show Character Remaining */}
                    <span
                      className={`absolute top-2 right-2 text-sm ${
                        field.value?.length === 12
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {12 - (field.value ? field.value.length : 0)}
                    </span>

                    {/*Show LastName Validation */}
                    {errors.LastName && (
                      <p className="absolute left-0 top-full text-red-600 text-sm mt-0.5">
                        {errors.LastName.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        {/* Username */}
        <div>
          <div className="mt-2.5 relative">
            <Controller
              name="Username"
              control={control}
              defaultValue=""
              rules={{ validate: validateUsername }}
              render={({ field }) => (
                <div>
                  <label
                    htmlFor="Username"
                    className="block text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Username
                  </label>
                  <div className="mt-2.5 relative">
                    <input
                      id="Username"
                      type="text"
                      placeholder="knight_owl"
                      maxLength={20}
                      {...field}
                      className="block w-full rounded-xl border bg-transparent border-gray-400 pl-3 pr-12 py-2 text-gray-900 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                    />

                    {/* Loader on right */}
                    {isCheckingUsername && (
                      <div className="absolute right-6 top-1/2 -translate-y-1/2">
                        <svg
                          className="animate-spin h-5 w-5 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                      </div>
                    )}

                    {/*Show Character Remaining */}
                    <span
                      className={`absolute top-2 right-2 text-sm ${
                        field.value?.length === 20
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {20 - (field.value ? field.value.length : 0)}
                    </span>

                    {/*Show Username Validation */}
                    {errors.Username && (
                      <p className="absolute left-0 top-full text-red-600 text-sm mt-0.5">
                        {errors.Username.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Password {/* Show password Strength */}
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
              {...register("Password", { validate: validatePassword })}
              onChange={(e) =>
                setValue("Password", e.target.value, { shouldValidate: true })
              }
              className="block w-full rounded-lg bg-transparent border border-gray-400 px-3 py-2 text-gray-900 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-indigo-600"
            >
              {showPassword ? <Eye size={19} /> : <EyeOff size={19} />}
            </button>

            {/*Show Password Validation */}
            {errors.Password && (
              <p className="absolute left-0 top-full text-red-600 text-sm mt-0.5">
                {errors.Password.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
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

      {/* Already have account? */}
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
