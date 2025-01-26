import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const Authenticate = () => {
    const [isSignup, setIsSignup] = useState(true); // Track whether it's login or signup
    const [showPassword, setShowPassword] = useState(false); // Track password visibility
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    const onSubmit = async (data) => {
        console.log("Form submitted:", data);
        try {
            const url = isSignup ? "http://localhost:3000/signup" : "http://localhost:3000/login";
            const response = await axios.post(url, data);
            console.log(response.data);
            alert(`${isSignup ? "Signup" : "Login"} successful!`);
            reset(); // Clear form after successful submission
            const token = response.data.token;
            if (token) {
                localStorage.setItem("token", token);
                // Redirect to dashboard
                window.location.href = "/";
            }
        } catch (error) {
            console.error(`${isSignup ? "Signup" : "Login"} failed:`, error.response?.data || error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
  <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-lg shadow-lg">
    <div className="flex justify-center mb-6">
      <button
        className={`w-1/2 py-2 text-sm sm:text-base font-semibold rounded-l-md ${
          isSignup ? "bg-indigo-600 text-white" : "bg-gray-300 text-gray-700"
        }`}
        onClick={() => setIsSignup(true)}
      >
        Sign Up
      </button>
      <button
        className={`w-1/2 py-2 text-sm sm:text-base font-semibold rounded-r-md ${
          isSignup ? "bg-gray-300 text-gray-700" : "bg-indigo-600 text-white"
        }`}
        onClick={() => setIsSignup(false)}
      >
        Log In
      </button>
    </div>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-900">
          Email
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
          className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
        />
        {errors.Email && <p className="text-red-500 text-sm mt-1">{errors.Email.message}</p>}
      </div>

      {isSignup && (
        <div>
          <label htmlFor="full-name" className="block text-sm font-medium text-gray-900">
            Full Name
          </label>
          <input
            id="full-name"
            type="text"
            placeholder="John Doe"
            {...register("FullName", { required: "Full Name is required" })}
            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
          />
          {errors.FullName && <p className="text-red-500 text-sm mt-1">{errors.FullName.message}</p>}
        </div>
      )}

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-900">
          Password
        </label>
        <div className="mt-2 relative">
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
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-indigo-600 text-sm"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.Password && <p className="text-red-500 text-sm mt-1">{errors.Password.message}</p>}
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
          {isSubmitting ? "Submitting..." : isSignup ? "Sign Up" : "Log In"}
        </button>
      </div>
    </form>
  </div>
</div>

    );
};

export default Authenticate;
