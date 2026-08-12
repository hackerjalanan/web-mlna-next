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
  x: number;
  color: string;
  peak: number;
  phase: "launch" | "explode";
  size: Size;
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

// Konfigurasi tiap ukuran kembang api
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

const SHOW_DURATION = 4000; // total durasi pertunjukan (ms)

export default function FireworkButton() {
  const [count, setCount] = useState<number>(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    setMounted(true);
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    const getCount = async () => {
      try {
        const response = await fetch("/api/fireworks", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch fireworks count");
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
    setTimeout(() => setParticles([]), 800);
  };

  const spawnFirework = useCallback((delay: number) => {
    const id = Date.now() + Math.random();
    const x = 5 + Math.random() * 90;
    const peak = 35 + Math.random() * 50;
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Bobot: lebih sering muncul ukuran kecil & sedang, besar lebih jarang (biar spesial)
    const roll = Math.random();
    const size: Size = roll < 0.4 ? "small" : roll < 0.8 ? "medium" : "large";
    const cfg = sizeConfig[size];

    const t1 = setTimeout(() => {
      setFireworks((prev) => [...prev, { id, x, color, peak, phase: "launch", size }]);

      const t2 = setTimeout(() => {
        setFireworks((prev) =>
          prev.map((f) => (f.id === id ? { ...f, phase: "explode" } : f))
        );

        const t3 = setTimeout(() => {
          setFireworks((prev) => prev.filter((f) => f.id !== id));
        }, cfg.burstDuration);
        timeoutsRef.current.push(t3);
      }, cfg.rocketDuration);
      timeoutsRef.current.push(t2);
    }, delay);
    timeoutsRef.current.push(t1);
  }, []);

  // Meluncurkan gelombang kembang api selama SHOW_DURATION, makin lama makin jarang
  const launchFireworks = useCallback(() => {
    let elapsed = 0;
    let wave = 0;

    while (elapsed < SHOW_DURATION) {
      // Tiap gelombang tembak 2-4 kembang api hampir bersamaan
      const burstCount = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < burstCount; i++) {
        spawnFirework(elapsed + i * 60 + Math.random() * 40);
      }

      wave++;
      // Interval antar gelombang makin renggang menjelang akhir (mereda)
      const progress = elapsed / SHOW_DURATION;
      const interval = 180 + progress * 300 + Math.random() * 150;
      elapsed += interval;
    }
  }, [spawnFirework]);

  const handleClick = async () => {
    if (loading || isSubmitting) return;
    setIsSubmitting(true);

    try {
      createButtonSparkle();
      launchFireworks();

      const response = await fetch("/api/fireworks", {
        method: "POST",
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Failed to increment fireworks");

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
      <div className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden">
        {fireworks.map((fw) => {
          const cfg = sizeConfig[fw.size];
          return (
            <div key={fw.id} className="absolute bottom-0" style={{ left: `${fw.x}%` }}>
              {fw.phase === "launch" ? (
                <span
                  className="firework-rocket"
                  style={
                    {
                      "--peak": `${fw.peak}vh`,
                      "--duration": `${cfg.rocketDuration}ms`,
                      width: `${Math.max(3, cfg.particleSize - 2)}px`,
                      height: `${cfg.particleSize * 2.5}px`,
                      backgroundColor: fw.color,
                      boxShadow: `0 0 ${cfg.particleSize + 4}px 2px ${fw.color}`,
                    } as React.CSSProperties
                  }
                />
              ) : (
                <div className="absolute" style={{ bottom: `${fw.peak}vh` }}>
                  {Array.from({ length: cfg.particleCount }).map((_, i) => (
                    <span
                      key={i}
                      className="firework-burst-particle"
                      style={
                        {
                          "--angle": `${(360 / cfg.particleCount) * i}deg`,
                          "--distance": `${cfg.distance[0] + Math.random() * (cfg.distance[1] - cfg.distance[0])}px`,
                          "--duration": `${cfg.burstDuration}ms`,
                          width: `${cfg.particleSize}px`,
                          height: `${cfg.particleSize}px`,
                          backgroundColor: fw.color,
                          boxShadow: `0 0 ${cfg.particleSize + 4}px ${fw.color}`,
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

      <div className="fixed bottom-6 right-6 z-[9999]">
        <div className="relative">
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

          <button
            type="button"
            onClick={handleClick}
            disabled={loading || isSubmitting}
            aria-label="Fireworks"
            className="
              group relative flex items-center gap-2 rounded-full border
              border-white/10 bg-slate-900/90 px-5 py-3 text-white shadow-xl
              shadow-cyan-500/20 backdrop-blur-xl transition-all duration-200
              hover:scale-110 hover:border-cyan-400/40 active:scale-90
              disabled:cursor-wait
            "
          >
            <span className="text-xl transition-transform duration-300 group-hover:rotate-12">
              🎆
            </span>
            <span className="min-w-[24px] text-center font-bold">
              {loading ? "..." : count}
            </span>
          </button>
        </div>
      </div>
    </>
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
}