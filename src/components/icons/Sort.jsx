// src/components/icons/Sort.jsx
export default function Sort({
  size = 24,
  color = "currentColor",
  className = "",
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18M6 12h12M9 18h6"></path>
    </svg>
  );
}
