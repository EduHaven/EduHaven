import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { debounce } from "lodash"; // Ensure lodash is installed: npm install lodash

const backendUrl = import.meta.env.VITE_API_URL;

function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordFeedback, setPasswordFeedback] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm();

  const evaluatePasswordStrength = debounce((password) => {
    const feedback = [];
    const lengthCriteria = password.length >= 8;
    const uppercaseCriteria = /[A-Z]/.test(password);
    const lowercaseCriteria = /[a-z]/.test(password);
    const digitCriteria = /[0-9]/.test(password);
    const specialCharCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!password) {
      setPasswordStrength("");
      setPasswordFeedback([]);
      return;
    }

    if (!lengthCriteria) feedback.push("Password must be at least 8 characters");
    if (!uppercaseCriteria) feedback.push("Include at least one uppercase letter");
    if (!lowercaseCriteria) feedback.push("Include at least one lowercase letter");
    if (!digitCriteria) feedback.push("Include at least one number");
    if (!specialCharCriteria) feedback.push("Include at least one special character");

    const passedCriteria = [lengthCriteria, uppercaseCriteria, lowercaseCriteria, digitCriteria, specialCharCriteria].filter(Boolean).length;

    setPasswordStrength(
      passedCriteria <= 2 ? "Weak" : passedCriteria <= 4 ? "Medium" : "Strong"
    );
    setPasswordFeedback(feedback);
  }, 300);

  const onSubmit = async (data) => {
    try {
      if (data.Password !== data.ConfirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      const url = '${backendUrl}/signup';
      if (!data.FirstName || !data.LastName) {
        throw new Error("First Name and Last Name are required");
      }

      const response = await axios.post(url, {
        email: data.Email,
        firstName: data.FirstName,
        lastName: data.LastName,
        password: data.Password,
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        toast.success("Account created successfully! Please login to continue.");
        reset();
        navigate("/authenticate");
      } else {
        throw new Error("No token received from server");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      const errorMessage =
        error.response?.status === 400
          ? "Invalid input data"
          : error.response?.status === 409
          ? "Email already exists"
          : error.response?.data?.error || "An error occurred during signup";
      toast.error(errorMessage);
    }
  };

  const handleGoogleLogin = () => {
    try {
      window.location.href = '${backendUrl}/auth/google';
    } catch (error) {
      console.error("Google login redirect failed:", error);
      toast.error("Failed to initiate Google login");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create Account
        </h2>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-2 border border-gray-400 rounded-xl text-black dark:text-white font-semibold p-2 text-lg w-full"
        aria-label="Continue with Google"
      >
        <img src="/GoogleIcon.svg" alt="" className="size-6" />
        <p>Continue with Google</p>
      </button>

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
              aria-invalid={errors.Email ? "true" : "false"}
              {...register("Email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
                maxLength: {
                  value: 100,
                  message: "Email must be less than 100 characters",
                },
              })}
              className="block w-full rounded-xl bg-transparent border border-gray-400 px-3 py-2 text-gray-900 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
            />
            {errors.Email && (
              <p className="text-red-500 text-sm mt-1" role="alert">
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
                aria-invalid={errors.FirstName ? "true" : "false"}
                {...register("FirstName", {
                  required: "First Name is required",
                  maxLength: {
                    value: 50,
                    message: "First Name must be less than 50 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z\s-]+$/,
                    message: "First Name can only contain letters, spaces, or hyphens",
                  },
                })}
                className="block w-full rounded-xl border bg-transparent border-gray-400 px-3 py-2 text-gray-900 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
              />
              {errors.FirstName && (
                <p className="text-red-500 text-sm mt-1" role="alert">
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
                aria-invalid={errors.LastName ? "true" : "false"}
                {...register("LastName", {
                  required: "Last Name is required",
                  maxLength: {
                    value: 50,
                    message: "Last Name must be less than 50 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z\s-]+$/,
                    message: "Last Name can only contain letters, spaces, or hyphens",
                  },
                })}
                className="block w-full rounded-xl border bg-transparent border-gray-400 px-3 py-2 text-gray-900 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
              />
              {errors.LastName && (
                <p className="text-red-500 text-sm mt-1" role="alert">
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
            Password
          </label>
          <div className="mt-2.5 relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder=""
              aria-invalid={errors.Password ? "true" : "false"}
              {...register("Password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                maxLength: {
                  value: 128,
                  message: "Password must be less than 128 characters",
                },
                onChange: (e) => evaluatePasswordStrength(e.target.value),
              })}
              className="block w-full rounded-lg bg-transparent border border-gray-400 px-3 py-2 text-gray-900 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-indigo-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <Eye size={19} /> : <EyeOff size={19} />}
            </button>
            {errors.Password && (
              <p className="text-red-500 text-sm mt-1" role="alert">
                {errors.Password.message}
              </p>
            )}
            {passwordStrength && (
              <p
                className={`text-sm mt-1 font-semibold ${
                  passwordStrength === "Weak"
                    ? "text-red-500"
                    : passwordStrength === "Medium"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                Password Strength: {passwordStrength}
              </p>
            )}
            {passwordFeedback.length > 0 && (
              <ul className="text-sm text-red-500 mt-1 list-disc list-inside">
                {passwordFeedback.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Confirm Password
          </label>
          <div className="mt-2.5 relative">
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder=""
              aria-invalid={errors.ConfirmPassword ? "true" : "false"}
              {...register("ConfirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("Password") || "Passwords do not match",
              })}
              className="block w-full rounded-lg bg-transparent border border-gray-400 px-3 py-2 text-gray-900 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-indigo-600"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <Eye size={19} /> : <EyeOff size={19} />}
            </button>
            {errors.ConfirmPassword && (
              <p className="text-red-500 text-sm mt-1" role="alert">
                {errors.ConfirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-md py-2 px-4 text-white font-semibold flex items-center justify-center ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed bg-gray-400"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            }`}
            aria-label={isSubmitting ? "Submitting" : "Create account"}
          >
            {isSubmitting && (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {isSubmitting ? "Submitting..." : "Create account"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignUp;