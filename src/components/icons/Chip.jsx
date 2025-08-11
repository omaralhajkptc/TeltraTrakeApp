// src/components/icons/Chip.jsx
import React from "react";

const ChipIcon = ({ size = 16, className = "", strokeWidth = 2 }) => (
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
    <path d="M6 9H3v6h3v-6zm6 0H9v6h3v-6zm6 0h-3v6h3v-6z"></path>
    <rect x="2" y="3" width="20" height="18" rx="2"></rect>
    <path d="M14 1v4M10 1v4M7 1v4"></path>
    <path d="M14 19v4M10 19v4M7 19v4"></path>
    <path d="M1 14h4M1 10h4M1 7h4"></path>
    <path d="M19 14h4M19 10h4M19 7h4"></path>
  </svg>
);

export default ChipIcon;
