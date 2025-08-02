import React, { useState } from 'react';
import PasswordStrengthChecker from '../components/PasswordStrengthChecker';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    alert(`Signed up with email: ${email}`); // ✅ Backticks used

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
        <form onSubmit={handleSignup}>
          <label className="block mb-2 font-medium">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
            placeholder="Enter your email"
          />

          <label className="block mb-2 font-medium">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:border-blue-500"
            placeholder="Create a password"
          />

          {/* Password Strength Checker */}
          <PasswordStrengthChecker password={password} />

          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;