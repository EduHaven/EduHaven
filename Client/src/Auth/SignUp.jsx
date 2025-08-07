import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
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
  } = useForm();
  const onSubmit = async (data) => {
    console.log("Form submitted:", data);
    try {
      const url = `${backendUrl}/signup`;
      if (!data.FirstName || !data.LastName) {
        throw new Error("First Name and Last Name are required");
      }
      // navigate("/verify");

      const response = await axios.post(url, data);
      console.log(response.data);
      reset();
      var token = undefined;
      if (data.token) {
        token = response.data.token;
      }
      // const activationToken = response.data.activationToken;

      if (token) {
        localStorage.setItem("token", token);
        // localStorage.setItem("activationToken", activationToken);
      }
      toast.success("Account created successfully! Please login to continue.");
      navigate("/authenticate");
    } catch (error) {
      console.error(`Signup failed:`, error.response?.data || error.message);
      toast.error(error.response?.data?.error || "An error occurred");
    }
  };
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create Account
        </h2>
      </div>

      <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-2 border border-gray-400 rounded-xl text-black dark:text-white font-semibold p-2 text-lg w-full">
        <img src="/GoogleIcon.svg" alt="Google sign-in" className="size-6" />

        <p>Continue with google</p>
      </button>
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
            Password
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
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-md py-2 px-4 text-white font-semibold ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed bg-gray-400"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Create account"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignUp;