"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import FireworksOverlay, {
  type FireworksOverlayHandle,
} from "./FireworksOverlay";

type FireworkButtonProps = {
  inline?: boolean;
  onLaunch?: () => void;
};

export default function FireworkButton({
  inline = false,
  onLaunch,
}: FireworkButtonProps) {
  const overlayRef = useRef<FireworksOverlayHandle | null>(null);

  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/fireworks", {
        method: "GET",
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });

      if (!res.ok) throw new Error("Failed to fetch fireworks count");

      const data = await res.json();
      setCount(Number(data.count) || 0);
    } catch (error) {
      console.error("Failed to get fireworks count:", error);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    fetchCount();
  }, [mounted, fetchCount]);

  /**
   * Klik sekarang boleh spam:
   * - visual langsung jalan setiap klik (tidak nunggu apa pun)
   * - counter di-update optimis di UI
   * - request ke API dikirim fire-and-forget di background
   */
  const handleClick = useCallback(() => {
    if (loading || count === null) return;

    // 1. Trigger visual langsung, boleh berkali-kali
    overlayRef.current?.launch();
    onLaunch?.();

    // 2. Optimistic update di UI
    setCount((prev) => (prev ?? 0) + 1);

    // 3. Kirim increment ke server di background, tidak blocking UI
    fetch("/api/v1/fireworks", {
      method: "POST",
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to increment fireworks");
        const data = await res.json();
        // Sinkronkan dengan angka asli dari server
        setCount(Number(data.count) || 0);
      })
      .catch((error) => {
        console.error("Failed to increment fireworks:", error);
        // Optional: bisa re-fetch count asli kalau mau strict-sync
      });
  }, [loading, count, onLaunch]);

  if (!mounted) return null;

  return (
    <>
      <FireworksOverlay ref={overlayRef} />

      <div className="relative flex flex-col items-center">
        {!inline && (
          <span className="mb-1 min-w-[28px] text-center text-xs font-semibold text-white/80">
            {loading ? "..." : count ?? 0}
          </span>
        )}

        <button
          type="button"
          onClick={handleClick}
          disabled={loading || count === null}
          aria-label="Fireworks"
          className="
            group
            relative
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            border
            border-white/10
            bg-slate-900/90
            text-white
            shadow-xl
            shadow-cyan-500/20
            backdrop-blur-xl
            transition-all
            duration-300
            hover:scale-110
            hover:border-cyan-400/40
            hover:shadow-cyan-400/40
            active:scale-90
            disabled:cursor-wait
            disabled:opacity-80
          "
        >
          <svg
            className="
              relative
              z-10
              h-8
              w-8
              animate-[pulse_1.2s_ease-in-out_infinite]
              drop-shadow-[0_0_10px_rgba(249,115,22,0.9)]
              transition-transform
              duration-300
              group-hover:scale-125
            "
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="fireGradient" x1="32" y1="8" x2="32" y2="58">
                <stop stopColor="#fde047" />
                <stop offset="0.45" stopColor="#f97316" />
                <stop offset="1" stopColor="#dc2626" />
              </linearGradient>
            </defs>

            <path
              d="M32 4 C38 15 49 20 49 34 C49 47 41 56 32 56 C19 56 12 47 12 36 C12 25 22 19 27 9 C28 7 30 5 32 4Z"
              fill="url(#fireGradient)"
              className="animate-[pulse_0.8s_ease-in-out_infinite]"
            />

            <path
              d="M32 22 C36 30 41 33 41 40 C41 47 37 51 32 51 C25 51 22 46 22 41 C22 35 27 31 32 22Z"
              fill="#fff7ed"
              className="animate-[pulse_0.6s_ease-in-out_infinite]"
            />
          </svg>
        </button>
      </div>
    </>
  );
}