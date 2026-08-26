"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

interface Particle {
  id: number;
  angle: number;
  color: string;
  distance: number;
}

type Size = "small" | "medium" | "large";

interface Firework {
  id: number;
  startX: number;
  endX: number;
  peak: number;
  curve: number;
  color: string;
  phase: "launch" | "explode";
  size: Size;
  particleDistances: number[];
}

const colors = [
  "#22d3ee",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#facc15",
  "#22c55e",
  "#ffffff",
  "#f97316",
  "#ef4444",
];

const sizeConfig: Record<
  Size,
  {
    particleCount: number;
    distance: [number, number];
    particleSize: number;
    rocketDuration: number;
    burstDuration: number;
  }
> = {
  small: {
    particleCount: 18,
    distance: [40, 70],
    particleSize: 4,
    rocketDuration: 450,
    burstDuration: 700,
  },

  medium: {
    particleCount: 36,
    distance: [80, 140],
    particleSize: 6,
    rocketDuration: 600,
    burstDuration: 950,
  },

  large: {
    particleCount: 60,
    distance: [130, 220],
    particleSize: 8,
    rocketDuration: 750,
    burstDuration: 1300,
  },
};

const SHOW_DURATION = 20500;

export default function FireworkButton() {
  const [count, setCount] = useState<number>(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShowRunning, setIsShowRunning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const fireworkIdRef = useRef(0);

  useEffect(() => {
    setMounted(true);

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    const getCount = async () => {
      try {
        const response = await fetch("/api/v1/fireworks", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch fireworks count");
        }

        const data = await response.json();
        setCount(data.count);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getCount();
  }, []);

  const createButtonSparkle = () => {
    const newParticles: Particle[] = [];

    for (let i = 0; i < 24; i++) {
      newParticles.push({
        id: Date.now() + i,
        angle: (360 / 24) * i,
        color: colors[Math.floor(Math.random() * colors.length)],
        distance: 60 + Math.random() * 40,
      });
    }

    setParticles(newParticles);

    const timeout = setTimeout(() => {
      setParticles([]);
    }, 800);

    timeoutsRef.current.push(timeout);
  };

  const spawnFirework = useCallback((delay: number) => {
    const id = fireworkIdRef.current++;

    // Titik awal roket
    const startX = 5 + Math.random() * 90;

    // Seberapa jauh roket bergerak ke kiri/kanan
    const horizontalDistance =
      -25 + Math.random() * 50;

    const endX = Math.max(
      3,
      Math.min(97, startX + horizontalDistance)
    );

    // Tinggi ledakan
    const peak = 35 + Math.random() * 45;

    // Lengkungan lintasan
    const curve =
      -15 + Math.random() * 30;

    const color =
      colors[Math.floor(Math.random() * colors.length)];

    const roll = Math.random();

    const size: Size =
      roll < 0.5
        ? "small"
        : roll < 0.85
          ? "medium"
          : "large";

    const cfg = sizeConfig[size];

    const particleDistances = Array.from(
      { length: cfg.particleCount },
      () =>
        cfg.distance[0] +
        Math.random() *
          (cfg.distance[1] - cfg.distance[0])
    );

    const t1 = setTimeout(() => {
      setFireworks((prev) => [
        ...prev,
        {
          id,
          startX,
          endX,
          peak,
          curve,
          color,
          phase: "launch",
          size,
          particleDistances,
        },
      ]);

      const t2 = setTimeout(() => {
        setFireworks((prev) =>
          prev.map((f) =>
            f.id === id
              ? {
                  ...f,
                  phase: "explode",
                }
              : f
          )
        );

        const t3 = setTimeout(() => {
          setFireworks((prev) =>
            prev.filter((f) => f.id !== id)
          );
        }, cfg.burstDuration);

        timeoutsRef.current.push(t3);
      }, cfg.rocketDuration);

      timeoutsRef.current.push(t2);
    }, delay);

    timeoutsRef.current.push(t1);
  }, []);

  const launchFireworks = useCallback(() => {
    let elapsed = 0;

    while (elapsed < SHOW_DURATION) {
      const burstCount =
        2 + Math.floor(Math.random() * 3);

      for (let i = 0; i < burstCount; i++) {
        spawnFirework(
          elapsed +
            i * 60 +
            Math.random() * 40
        );
      }

      const progress = elapsed / SHOW_DURATION;

      const interval =
        180 +
        progress * 300 +
        Math.random() * 150;

      elapsed += interval;
    }
  }, [spawnFirework]);

  const handleClick = async () => {
    if (loading || isSubmitting || isShowRunning) return;

    setIsSubmitting(true);
    setIsShowRunning(true);

    try {
      setShowGreeting(true);

      createButtonSparkle();
      launchFireworks();

      const greetingTimeout = setTimeout(() => {
        setShowGreeting(false);
        setIsShowRunning(false);
      }, SHOW_DURATION + 500);

      timeoutsRef.current.push(greetingTimeout);

      const response = await fetch("/api/fireworks", {
        method: "POST",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          "Failed to increment fireworks"
        );
      }

      const data = await response.json();

      setCount(data.count);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <>
      {/* =========================================
          FIREWORKS BACKGROUND
      ========================================== */}
      <div className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden">
        {fireworks.map((fw) => {
          const cfg = sizeConfig[fw.size];

          return (
           <div
              key={fw.id}
              className="absolute bottom-0"
              style={{
                left: `${fw.startX}%`,
              }}
            >
              {fw.phase === "launch" ? (
                <span
                  className="firework-rocket"
                  style={
                    {
                      "--start-x": "0px",
                      "--end-x": `${(fw.endX - fw.startX) * 1}vw`,
                      "--peak": `${fw.peak}vh`,
                      "--curve": `${fw.curve}vw`,
                      "--duration": `${cfg.rocketDuration}ms`,
                      width: `${Math.max(
                        3,
                        cfg.particleSize - 2
                      )}px`,
                      height: `${cfg.particleSize * 2.5}px`,
                      backgroundColor: fw.color,
                      boxShadow: `0 0 ${
                        cfg.particleSize + 4
                      }px 2px ${fw.color}`,
                    } as React.CSSProperties
                  }
                />
              ) : (
                <div
                  className="absolute"
                  style={{
                    bottom: `${fw.peak}vh`,
                  }}
                >
                  {Array.from({
                    length: cfg.particleCount,
                  }).map((_, i) => (
                    <span
                      key={i}
                      className="firework-burst-particle"
                      style={
                        {
                          "--angle": `${
                            (360 / cfg.particleCount) * i
                          }deg`,
                          "--distance": `${fw.particleDistances[i]}px`,
                          "--duration": `${cfg.burstDuration}ms`,
                          width: `${cfg.particleSize}px`,
                          height: `${cfg.particleSize}px`,
                          backgroundColor: fw.color,
                          boxShadow: `0 0 ${
                            cfg.particleSize + 4
                          }px ${fw.color}`,
                        } as React.CSSProperties
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* =========================================
          DIRGAHAYU INDONESIA
      ========================================== */}
      {showGreeting && (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
          <div className="dirgahayu-floating">
            <div className="indonesia-flag">
              <div className="flag-red" />
              <div className="flag-white" />
            </div>

            <div className="mt-1 text-center text-white">
              <div className="text-[10px]">
                DIRGAHAYU
              </div>

              <div className="text-[11px]">
                REPUBLIK INDONESIA
              </div>

              <div className="text-[16px]">
                81
              </div>

              <div className="text-[7px]">
                TAHUN
              </div>
            </div>
          </div>
        </div>
      )}
      {/* =========================================
          FIREWORK BUTTON
      ========================================== */}
      <div className="fixed bottom-22 right-6 z-[10000] md:bottom-9">
        <div className="relative flex flex-col items-center">

          {/* Jumlah kembang api */}
          <span
            className="
              mb-1 min-w-[28px]
              text-center text-xs font-semibold
              text-white/80
            "
          >
            {loading ? "..." : count}
          </span>

          {/* Particle */}
          {particles.map((particle) => (
            <span
              key={particle.id}
              className="firework-particle"
              style={
                {
                  "--angle": `${particle.angle}deg`,
                  "--distance": `${particle.distance}px`,
                  backgroundColor: particle.color,
                  boxShadow: `0 0 8px ${particle.color}`,
                } as React.CSSProperties
              }
            />
          ))}

          {/* Tombol */}
          <button
            type="button"
            onClick={handleClick}
            disabled={loading || isSubmitting}
            aria-label="Fireworks"
            className="
              group relative
              flex h-14 w-14
              items-center justify-center
              rounded-full
              border border-white/10
              bg-slate-900/90
              text-white
              shadow-xl shadow-cyan-500/20
              backdrop-blur-xl
              transition-all duration-200
              hover:scale-110
              hover:border-cyan-400/40
              hover:shadow-cyan-400/40
              active:scale-90
              disabled:cursor-wait
            "
          >
            <span
              className="
                block text-2xl
                animate-[spin_3s_linear_infinite]
                transition-transform
                group-hover:scale-110
              "
            >
              🎆
            </span>
          </button>
        </div>
      </div>
    </>
  );

  if (!mounted) return null;

  return createPortal(
    content,
    document.body
  );
}