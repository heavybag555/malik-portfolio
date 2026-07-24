interface ArrowUpRightProps {
  className?: string;
}

export default function ArrowUpRight({ className = "" }: ArrowUpRightProps) {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M1.5 6.5L6.5 1.5M6.5 1.5H2M6.5 1.5V6"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
      />
    </svg>
  );
}
