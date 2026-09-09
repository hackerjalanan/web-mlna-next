"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const COLORS = [
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

const SHOW_DURATION = 10500;

type FireworkButtonProps = {
  inline?: boolean;
  onLaunch?: () => void;
};

type Rocket = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  trail: {
    x: number;
    y: number;
    alpha: number;
  }[];
};

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  friction: number;
  alpha: number;
  decay: number;
  size: number;
  color: string;
  twinkle: number;
};

type Flash = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  color: string;
};

export default function FireworkButton({
  inline = false,
  onLaunch,
}: FireworkButtonProps) {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const animationRef =
    useRef<number | null>(null);

  const runningRef =
    useRef(false);

  const showStartRef =
    useRef(0);

  const nextLaunchRef =
    useRef(0);

  const rocketsRef =
    useRef<Rocket[]>([]);

  const sparksRef =
    useRef<Spark[]>([]);

  const flashesRef =
    useRef<Flash[]>([]);

  const [count, setCount] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isShowRunning, setIsShowRunning] =
    useState(false);

  const [mounted, setMounted] =
    useState(false);

  /**
   * ---------------------------------------------------------
   * RANDOM HELPERS
   * ---------------------------------------------------------
   */

  const random = (
    min: number,
    max: number,
  ) => {
    return (
      min +
      Math.random() * (max - min)
    );
  };

  const randomColor = () => {
    return COLORS[
      Math.floor(
        Math.random() * COLORS.length,
      )
    ];
  };

  /**
   * ---------------------------------------------------------
   * FETCH COUNTER
   * ---------------------------------------------------------
   */

  const fetchCount = useCallback(
    async () => {
      try {
        const res = await fetch(
          "/api/v1/fireworks",
          {
            method: "GET",
            cache: "no-store",
            headers: {
              "Cache-Control":
                "no-cache",
            },
          },
        );

        if (!res.ok) {
          throw new Error(
            "Failed to fetch fireworks count",
          );
        }

        const data =
          await res.json();

        setCount(
          Number(data.count) || 0,
        );
      } catch (error) {
        console.error(
          "Failed to get fireworks count:",
          error,
        );

        setCount(0);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * ---------------------------------------------------------
   * MOUNT
   * ---------------------------------------------------------
   */

  useEffect(() => {
    setMounted(true);

    return () => {
      if (
        animationRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationRef.current,
        );
      }

      runningRef.current = false;
      rocketsRef.current = [];
      sparksRef.current = [];
      flashesRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    fetchCount();
  }, [mounted, fetchCount]);

  /**
   * ---------------------------------------------------------
   * CANVAS RESIZE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!mounted) return;

    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    const resize = () => {
      const dpr =
        Math.min(
          window.devicePixelRatio || 1,
          2,
        );

      canvas.width =
        window.innerWidth * dpr;

      canvas.height =
        window.innerHeight * dpr;

      canvas.style.width =
        `${window.innerWidth}px`;

      canvas.style.height =
        `${window.innerHeight}px`;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0,
      );
    };

    resize();

    window.addEventListener(
      "resize",
      resize,
    );

    return () => {
      window.removeEventListener(
        "resize",
        resize,
      );
    };
  }, [mounted]);

  /**
   * ---------------------------------------------------------
   * CREATE EXPLOSION
   * ---------------------------------------------------------
   */

  const explode = useCallback(
    (
      x: number,
      y: number,
      color: string,
    ) => {
      const sizeRoll =
        Math.random();

      const particleCount =
        sizeRoll > 0.86
          ? 90
          : sizeRoll > 0.45
            ? 65
            : 45;

      const baseSpeed =
        sizeRoll > 0.86
          ? random(3.8, 6.2)
          : sizeRoll > 0.45
            ? random(3, 5)
            : random(2.2, 4);

      /**
       * Main explosion
       */
      for (
        let i = 0;
        i < particleCount;
        i++
      ) {
        const angle =
          (Math.PI * 2 * i) /
            particleCount +
          random(-0.08, 0.08);

        const speed =
          baseSpeed *
          random(0.65, 1.25);

        sparksRef.current.push({
          x,
          y,

          vx:
            Math.cos(angle) *
            speed,

          vy:
            Math.sin(angle) *
            speed,

          gravity: random(
            0.045,
            0.095,
          ),

          friction: random(
            0.975,
            0.988,
          ),

          alpha: 1,

          decay: random(
            0.007,
            0.014,
          ),

          size: random(
            1,
            2.8,
          ),

          color:
            Math.random() > 0.78
              ? "#ffffff"
              : color,

          twinkle: random(
            0.5,
            1.5,
          ),
        });
      }

      /**
       * Secondary small sparks.
       */
      if (
        Math.random() > 0.48
      ) {
        const secondaryCount =
          Math.floor(
            particleCount * 0.35,
          );

        for (
          let i = 0;
          i < secondaryCount;
          i++
        ) {
          const angle =
            Math.random() *
            Math.PI *
            2;

          const speed =
            random(1.2, 3.2);

          sparksRef.current.push({
            x,
            y,

            vx:
              Math.cos(angle) *
              speed,

            vy:
              Math.sin(angle) *
              speed,

            gravity: random(
              0.025,
              0.065,
            ),

            friction: random(
              0.98,
              0.992,
            ),

            alpha: 1,

            decay: random(
              0.009,
              0.018,
            ),

            size: random(
              0.6,
              1.6,
            ),

            color:
              Math.random() > 0.45
                ? color
                : "#ffffff",

            twinkle: random(
              0.5,
              1.2,
            ),
          });
        }
      }

      /**
       * Explosion flash.
       */
      flashesRef.current.push({
        x,
        y,
        radius: 8,
        alpha: 0.95,
        color,
      });
    },
    [],
  );

  /**
   * ---------------------------------------------------------
   * CREATE ROCKET
   * ---------------------------------------------------------
   */

  const createRocket =
    useCallback(() => {
      const width =
        window.innerWidth;

      const height =
        window.innerHeight;

      const x =
        random(
          width * 0.08,
          width * 0.92,
        );

      /**
       * Explosion position.
       */
      const targetX =
        x +
        random(-width * 0.18, width * 0.18);

      const targetY =
        random(
          height * 0.15,
          height * 0.5,
        );

      const startY =
        height + 25;

      const distance =
        startY - targetY;

      const duration =
        random(45, 65);

      const vy =
        -(distance / duration);

      const vx =
        (targetX - x) /
        duration;

      rocketsRef.current.push({
        x,
        y: startY,

        targetX,
        targetY,

        vx,
        vy,

        color:
          randomColor(),

        trail: [],
      });
    }, []);

  /**
   * ---------------------------------------------------------
   * DRAW ROCKET
   * ---------------------------------------------------------
   */

  const drawRocket = (
    ctx: CanvasRenderingContext2D,
    rocket: Rocket,
  ) => {
    /**
     * Trail.
     */
    for (
      let i = 0;
      i < rocket.trail.length;
      i++
    ) {
      const point =
        rocket.trail[i];

      const alpha =
        (i /
          rocket.trail.length) *
        0.55;

      ctx.beginPath();

      ctx.arc(
        point.x,
        point.y,
        random(0.7, 1.5),
        0,
        Math.PI * 2,
      );

      ctx.fillStyle =
        `rgba(255,255,255,${alpha})`;

      ctx.fill();
    }

    /**
     * Rocket glow.
     */
    const gradient =
      ctx.createRadialGradient(
        rocket.x,
        rocket.y,
        0,
        rocket.x,
        rocket.y,
        9,
      );

    gradient.addColorStop(
      0,
      "#ffffff",
    );

    gradient.addColorStop(
      0.25,
      rocket.color,
    );

    gradient.addColorStop(
      1,
      "transparent",
    );

    ctx.fillStyle =
      gradient;

    ctx.beginPath();

    ctx.arc(
      rocket.x,
      rocket.y,
      9,
      0,
      Math.PI * 2,
    );

    ctx.fill();

    /**
     * Rocket head.
     */
    ctx.beginPath();

    ctx.arc(
      rocket.x,
      rocket.y,
      2,
      0,
      Math.PI * 2,
    );

    ctx.fillStyle =
      "#ffffff";

    ctx.fill();
  };

  /**
   * ---------------------------------------------------------
   * DRAW SPARK
   * ---------------------------------------------------------
   */

  const drawSpark = (
    ctx: CanvasRenderingContext2D,
    spark: Spark,
  ) => {
    const twinkle =
      0.65 +
      Math.sin(
        performance.now() *
          0.012 *
          spark.twinkle,
      ) *
        0.35;

    const radius =
      spark.size *
      twinkle;

    const gradient =
      ctx.createRadialGradient(
        spark.x,
        spark.y,
        0,
        spark.x,
        spark.y,
        radius * 5,
      );

    gradient.addColorStop(
      0,
      `rgba(255,255,255,${spark.alpha})`,
    );

    gradient.addColorStop(
      0.25,
      spark.color,
    );

    gradient.addColorStop(
      1,
      "transparent",
    );

    ctx.fillStyle =
      gradient;

    ctx.beginPath();

    ctx.arc(
      spark.x,
      spark.y,
      radius * 5,
      0,
      Math.PI * 2,
    );

    ctx.fill();

    /**
     * Bright core.
     */
    ctx.beginPath();

    ctx.arc(
      spark.x,
      spark.y,
      radius,
      0,
      Math.PI * 2,
    );

    ctx.fillStyle =
      spark.color;

    ctx.fill();
  };

  /**
   * ---------------------------------------------------------
   * ANIMATION LOOP
   * ---------------------------------------------------------
   */

  const animate =
    useCallback(
      (time: number) => {
        const canvas =
          canvasRef.current;

        if (!canvas) return;

        const ctx =
          canvas.getContext("2d");

        if (!ctx) return;

        const width =
          window.innerWidth;

        const height =
          window.innerHeight;

        /**
         * Soft fade instead of clearing instantly.
         *
         * This creates natural light trails.
         */
        ctx.fillStyle =
          "rgba(2, 6, 23, 0.16)";

        ctx.fillRect(
          0,
          0,
          width,
          height,
        );

        /**
         * -----------------------------------------------------
         * LAUNCH NEW ROCKET
         * -----------------------------------------------------
         */

        if (
          time >=
          nextLaunchRef.current
        ) {
          createRocket();

          /**
           * Random launch interval.
           */
          nextLaunchRef.current =
            time +
            random(180, 650);

          /**
           * Sometimes launch two.
           */
          if (
            Math.random() > 0.78
          ) {
            setTimeout(() => {
              if (
                runningRef.current
              ) {
                createRocket();
              }
            }, random(60, 180));
          }
        }

        /**
         * -----------------------------------------------------
         * UPDATE ROCKETS
         * -----------------------------------------------------
         */

        const rockets =
          rocketsRef.current;

        for (
          let i = rockets.length - 1;
          i >= 0;
          i--
        ) {
          const rocket =
            rockets[i];

          /**
           * Save trail point.
           */
          rocket.trail.push({
            x: rocket.x,
            y: rocket.y,
            alpha: 1,
          });

          if (
            rocket.trail.length >
            12
          ) {
            rocket.trail.shift();
          }

          /**
           * Slight horizontal drift.
           */
          rocket.vx +=
            random(
              -0.008,
              0.008,
            );

          rocket.vx *= 0.998;

          /**
           * Rocket slows near target.
           */
          const distanceY =
            rocket.y -
            rocket.targetY;

          if (
            distanceY <
            100
          ) {
            rocket.vy *=
              0.985;
          }

          rocket.x +=
            rocket.vx;

          rocket.y +=
            rocket.vy;

          drawRocket(
            ctx,
            rocket,
          );

          /**
           * Explode when reaching target.
           */
          if (
            rocket.y <=
              rocket.targetY ||
            Math.abs(
              rocket.x -
                rocket.targetX,
            ) < 8 &&
              rocket.y <
                rocket.targetY +
                  30
          ) {
            explode(
              rocket.x,
              rocket.y,
              rocket.color,
            );

            rockets.splice(
              i,
              1,
            );
          }
        }

        /**
         * -----------------------------------------------------
         * UPDATE SPARKS
         * -----------------------------------------------------
         */

        const sparks =
          sparksRef.current;

        for (
          let i = sparks.length - 1;
          i >= 0;
          i--
        ) {
          const spark =
            sparks[i];

          spark.vx *=
            spark.friction;

          spark.vy *=
            spark.friction;

          spark.vy +=
            spark.gravity;

          spark.x +=
            spark.vx;

          spark.y +=
            spark.vy;

          spark.alpha -=
            spark.decay;

          if (
            spark.alpha <=
              0 ||
            spark.y >
              height + 50
          ) {
            sparks.splice(
              i,
              1,
            );

            continue;
          }

          drawSpark(
            ctx,
            spark,
          );
        }

        /**
         * -----------------------------------------------------
         * UPDATE FLASHES
         * -----------------------------------------------------
         */

        const flashes =
          flashesRef.current;

        for (
          let i = flashes.length - 1;
          i >= 0;
          i--
        ) {
          const flash =
            flashes[i];

          flash.radius +=
            4.5;

          flash.alpha *=
            0.86;

          const gradient =
            ctx.createRadialGradient(
              flash.x,
              flash.y,
              0,
              flash.x,
              flash.y,
              flash.radius,
            );

          gradient.addColorStop(
            0,
            `rgba(255,255,255,${flash.alpha})`,
          );

          gradient.addColorStop(
            0.15,
            `${flash.color}`,
          );

          gradient.addColorStop(
            1,
            "transparent",
          );

          ctx.fillStyle =
            gradient;

          ctx.beginPath();

          ctx.arc(
            flash.x,
            flash.y,
            flash.radius,
            0,
            Math.PI * 2,
          );

          ctx.fill();

          if (
            flash.alpha <
            0.025
          ) {
            flashes.splice(
              i,
              1,
            );
          }
        }

        /**
         * -----------------------------------------------------
         * END SHOW
         * -----------------------------------------------------
         */

        const elapsed =
          time -
          showStartRef.current;

        if (
          elapsed >=
          SHOW_DURATION
        ) {
          /**
           * Jangan langsung berhenti.
           * Biarkan sisa particle selesai.
           */
          if (
            rockets.length ===
              0 &&
            sparks.length ===
              0 &&
            flashes.length ===
              0
          ) {
            runningRef.current =
              false;

            setIsShowRunning(
              false,
            );

            ctx.clearRect(
              0,
              0,
              width,
              height,
            );

            return;
          }
        }

        animationRef.current =
          requestAnimationFrame(
            animate,
          );
      },
      [createRocket, explode],
    );

  /**
   * ---------------------------------------------------------
   * START SHOW
   * ---------------------------------------------------------
   */

  const launchFireworks =
    useCallback(() => {
      if (
        runningRef.current
      ) {
        return;
      }

      runningRef.current =
        true;

      rocketsRef.current =
        [];

      sparksRef.current =
        [];

      flashesRef.current =
        [];

      const canvas =
        canvasRef.current;

      if (canvas) {
        const ctx =
          canvas.getContext("2d");

        if (ctx) {
          ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight,
          );
        }
      }

      const now =
        performance.now();

      showStartRef.current =
        now;

      nextLaunchRef.current =
        now + 150;

      animationRef.current =
        requestAnimationFrame(
          animate,
        );
    }, [animate]);

  /**
   * ---------------------------------------------------------
   * CLICK
   * ---------------------------------------------------------
   */

  const handleClick =
    useCallback(
      async () => {
        if (
          loading ||
          count === null ||
          isSubmitting ||
          isShowRunning
        ) {
          return;
        }

        setIsSubmitting(true);
        setIsShowRunning(true);

        launchFireworks();

        onLaunch?.();

        try {
          const res =
            await fetch(
              "/api/v1/fireworks",
              {
                method: "POST",
                cache: "no-store",
                headers: {
                  "Cache-Control":
                    "no-cache",
                },
              },
            );

          if (!res.ok) {
            throw new Error(
              "Failed to increment fireworks",
            );
          }

          const data =
            await res.json();

          setCount(
            Number(data.count) ||
              0,
          );
        } catch (error) {
          console.error(
            "Failed to increment fireworks:",
            error,
          );

          setCount(
            (prev) =>
              prev ?? 0,
          );
        } finally {
          setIsSubmitting(false);
        }
      },
      [
        loading,
        count,
        isSubmitting,
        isShowRunning,
        launchFireworks,
        onLaunch,
      ],
    );

  /**
   * ---------------------------------------------------------
   * SSR GUARD
   * ---------------------------------------------------------
   */

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* =====================================================
          CANVAS FIREWORK
      ====================================================== */}

      <canvas
        ref={canvasRef}
        className="
          pointer-events-none
          fixed
          inset-0
          z-[10000]
          h-full
          w-full
        "
        aria-hidden="true"
      />

      {/* =====================================================
          BUTTON
      ====================================================== */}

      <div className="relative flex flex-col items-center">
        {!inline && (
          <span
            className="
              mb-1
              min-w-[28px]
              text-center
              text-xs
              font-semibold
              text-white/80
            "
          >
            {loading
              ? "..."
              : count ?? 0}
          </span>
        )}

        <button
          type="button"
          onClick={handleClick}
          disabled={
            loading ||
            count === null ||
            isSubmitting ||
            isShowRunning
          }
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
              <linearGradient
                id="fireGradient"
                x1="32"
                y1="8"
                x2="32"
                y2="58"
              >
                <stop
                  stopColor="#fde047"
                />
                <stop
                  offset="0.45"
                  stopColor="#f97316"
                />
                <stop
                  offset="1"
                  stopColor="#dc2626"
                />
              </linearGradient>
            </defs>

            <path
              d="
                M32 4
                C38 15 49 20 49 34
                C49 47 41 56 32 56
                C19 56 12 47 12 36
                C12 25 22 19 27 9
                C28 7 30 5 32 4Z
              "
              fill="url(#fireGradient)"
              className="
                animate-[pulse_0.8s_ease-in-out_infinite]
              "
            />

            <path
              d="
                M32 22
                C36 30 41 33 41 40
                C41 47 37 51 32 51
                C25 51 22 46 22 41
                C22 35 27 31 32 22Z
              "
              fill="#fff7ed"
              className="
                animate-[pulse_0.6s_ease-in-out_infinite]
              "
            />
          </svg>
        </button>
      </div>
    </>
  );
}
