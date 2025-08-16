// src/components/icons/SimUpdate.jsx
import React from "react";

const SimUpdate = ({ size = 16, className = "", strokeWidth = 2 }) => (
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
    <path d="M18 12l-2-2" />
    <path d="M2 12h20" />
    <path d="M4 12l2 2" />
    <path d="M8 6l-2-2-2 2" />
    <path d="M4 6v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-2" />
    <path d="M16 18l2 2 2-2" />
  </svg>
);

export default SimUpdate;
