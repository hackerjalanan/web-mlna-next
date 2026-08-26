"use client";

interface LoadingProps {
  label?: string;
  size?: number;
}

export default function Loading({
  label = "Memuat...",
  size = 32,
}: LoadingProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3"
      role="status"
      aria-live="polite"
    >
      <span
        className="block rounded-full border-[3px] border-cyan-400/10 border-t-cyan-400 border-r-blue-400"
        style={{
          width: size,
          height: size,
          animation: "loading-spin 0.7s linear infinite",
          filter:
            "drop-shadow(0 0 5px rgba(0, 207, 255, 0.35))",
        }}
      />

      {label && (
        <span className="text-[13px] font-medium text-cyan-100/75">
          {label}
        </span>
      )}

      <style jsx>{`
        @keyframes loading-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          span {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}