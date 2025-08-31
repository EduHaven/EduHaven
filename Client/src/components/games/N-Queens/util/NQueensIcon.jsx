// src/assets/icon/NQueensIcon.jsx

import React from "react";

export default function NQueensIcon({ className = "", ...props }) {
  // Use gray-blue (LinkedIn/game icon style)
  const iconColor = "#6B7683";
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Queen base */}
      <ellipse cx="24" cy="41" rx="13" ry="4" fill={iconColor} />
      {/* Simplified body */}
      <rect x="16" y="16" width="16" height="20" rx="8" fill={iconColor} />
      {/* Crown */}
      <rect x="20" y="8" width="8" height="10" rx="2" fill={iconColor} />
      <circle cx="18" cy="10" r="2" fill={iconColor} />
      <circle cx="24" cy="7" r="2" fill={iconColor} />
      <circle cx="30" cy="10" r="2" fill={iconColor} />
      {/* Crown dots */}
      <circle cx="18" cy="9.2" r="0.7" fill="#fff" />
      <circle cx="24" cy="7.2" r="0.7" fill="#fff" />
      <circle cx="30" cy="9.2" r="0.7" fill="#fff" />
      {/* Body lines */}
      <rect x="21" y="19" width="2" height="11" rx="1" fill="#fff" opacity="0.4"/>
      <rect x="25" y="19" width="2" height="11" rx="1" fill="#fff" opacity="0.4"/>
    </svg>
  );
}
