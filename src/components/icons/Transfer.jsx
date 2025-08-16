// src/components/icons/Transfer.jsx
export default function Transfer({ size = 24, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 12l5-5-5-5" />
      <path d="M22 7H2" />
      <path d="M7 12l-5 5 5 5" />
      <path d="M2 17h20" />
    </svg>
  );
}
