import React, { useState } from 'react';

const PasswordStrengthChecker = () => {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);

  const strengthLevels = [
    { label: 'Very Weak', color: 'bg-red-500' },
    { label: 'Weak', color: 'bg-orange-500' },
    { label: 'Medium', color: 'bg-yellow-500' },
    { label: 'Strong', color: 'bg-green-500' },
    { label: 'Very Strong', color: 'bg-emerald-600' },
  ];

  const checkPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++;
    return score;
  };

  const handleChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setStrength(checkPasswordStrength(pwd));
  };

  const progressWidth = `${(strength / 5) * 100}%`;

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow-md">
      <label className="block mb-2 font-semibold text-gray-700">Create Password:</label>
      <input
        type="password"
        value={password}
        onChange={handleChange}
        placeholder="Enter your password"
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="mt-3">
        <div className="w-full bg-gray-300 rounded h-2">
          <div
            className={`h-2 rounded transition-all duration-300 ${strengthLevels[strength - 1]?.color || ''}`}
            style={{ width: progressWidth }}
          ></div>
        </div>
        <p className="text-sm mt-1 font-medium text-gray-700">
          {password.length > 0
            ? strengthLevels[strength - 1]?.label || 'Too Short'
            : 'Enter a password'}
        </p>
      </div>
    </div>
  );
};

export default PasswordStrengthChecker;
