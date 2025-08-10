// src/components/icons/Bell.jsx
export default function Bell({ size = 24, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
    >
      <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3z" />
      <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
    </svg>
  );
}
