import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import PasswordStrengthChecker from "./PasswordStrengthChecker";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { HiEye, HiEyeOff } from "react-icons/hi";

const Signup = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");

  const onSubmit = (data) => {
    const author = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role || "student",
    };
    console.log("Author info:", author);
    console.log("Password:", data.password);
    toast.success("Account created successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-white px-4">
      <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>

        {/* Google Sign In */}
        <button
          type="button"
          className="flex items-center justify-center w-full gap-3 border border-gray-300 py-3 rounded-md hover:bg-gray-100 transition mb-6"
        >
          <FcGoogle size={22} />
          <span className="font-medium text-gray-700">Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First & Last Name */}
          <div className="flex gap-3">
            <div className="w-1/2">
              <input
                type="text"
                placeholder="First Name"
                {...register("firstName", { required: "First name is required" })}
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div className="w-1/2">
              <input
                type="text"
                placeholder="Last Name"
                {...register("lastName", { required: "Last name is required" })}
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 pr-10"
            />
            <div
              className="absolute top-3 right-3 text-gray-500 cursor-pointer"
              onClick={() => setPasswordVisible((prev) => !prev)}
            >
              {passwordVisible ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Password Strength */}
          <PasswordStrengthChecker password={password} />

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            Create Account
          </button>

          {/* Already have account */}
          <p className="text-center text-sm text-gray-600 mt-3">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
