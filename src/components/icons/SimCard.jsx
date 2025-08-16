// src/components/icons/SimCard.jsx
import React from "react";

const SimCard = ({ size = 16, className = "", strokeWidth = 2 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <circle cx="12" cy="12" r="1" />
    <path d="M12 9v3" />
    <path d="M12 15v0" />
    <path d="M8 19h8" />
    <path d="M8 5h8" />
    <path d="M16 3v4M8 3v4" />
    <path d="M16 21v-2M8 21v-2" />
    <path d="M19 12h1" />
    <path d="M4 12h1" />
    <path d="M19 8h1" />
    <path d="M4 8h1" />
    <path d="M19 16h1" />
    <path d="M4 16h1" />
  </svg>
);

export default SimCard;
