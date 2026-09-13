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
        className="block rounded-full border-[3px] border-white/10 border-t-[#A855F7]"
        style={{
          width: size,
          height: size,
          animation: "loading-spin 0.7s linear infinite",
        }}
      />

      {label && (
        <span className="text-[13px] font-medium text-white/50">
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