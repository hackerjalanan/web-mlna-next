"use client";

import {
  BriefcaseBusiness,
  Code2,
  FolderKanban,
  GraduationCap,
} from "lucide-react";
import {
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

/*
|--------------------------------------------------------------------------
| Theme tokens
|--------------------------------------------------------------------------
| Background : #050505 (near-black)
| Purple     : #8B5CF6  -> primary / tech
| Red        : #EF4444  -> security / important
| Emerald    : #10B981  -> success / stable
| Blue       : #3B82F6  -> extra accent, used sparingly
| Heading    : #FFFFFF
| Body       : white/50
*/

const stats = [
  {
    value: 1,
    suffix: "+",
    label: "Years Experience",
    icon: BriefcaseBusiness,
    accent: "#10B981", // emerald — stable, established
  },
  {
    value: 10,
    suffix: "+",
    label: "Technologies",
    icon: Code2,
    accent: "#8B5CF6", // purple — tech
  },
  {
    value: 10,
    suffix: "+",
    label: "Projects",
    icon: FolderKanban,
    accent: "#3B82F6", // blue — accent, used sparingly
  },
  {
    value: "S1",
    suffix: "",
    label: "Information Systems",
    icon: GraduationCap,
    accent: "#8B5CF6", // purple — tech/education root
  },
];

/*
|--------------------------------------------------------------------------
| Animated Number
|--------------------------------------------------------------------------
*/

function AnimatedNumber({
  value,
  suffix,
  active,
}: {
  value: number | string;
  suffix: string;
  active: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();

  const [count, setCount] = useState(
    typeof value === "number" && prefersReducedMotion ? value : 0
  );

  useEffect(() => {
    if (typeof value !== "number") return;

    if (prefersReducedMotion) {
      setCount(value);
      return;
    }

    if (!active) return;

    let startTime: number | null = null;
    const duration = 1100;
    let frameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(easedProgress * value));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [active, prefersReducedMotion, value]);

  if (typeof value === "string") {
    return <span>{value}</span>;
  }

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| Quick Profile
|--------------------------------------------------------------------------
*/

export default function QuickProfile() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.25,
  });

  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      ref={sectionRef}
      className="
        relative
        bg-[#050505]
        px-4
        py-24
        sm:px-6
        md:py-28
        lg:px-10
      "
    >
      <div
        className="
          relative
          mx-auto
          grid
          max-w-[1200px]
          gap-14
          md:grid-cols-[1.1fr_1fr]
          md:items-center
          lg:gap-24
        "
      >
        {/* =====================================================
            DESCRIPTION
        ===================================================== */}

        <motion.div
          initial={
            prefersReducedMotion ? undefined : { opacity: 0, y: 24 }
          }
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p
            className="
              mb-4
              text-xs
              font-medium
              text-white/40
            "
          >
            About me
          </p>

          <h2
            className="
              text-4xl
              font-semibold
              leading-[1.1]
              tracking-tight
              text-white
              sm:text-5xl
            "
          >
            Fullstack Developer
          </h2>

          <p
            className="
              mt-6
              max-w-xl
              text-sm
              leading-7
              text-white/50
              sm:text-base
            "
          >
            Saya memiliki latar belakang Sistem Informasi dan pengalaman
            dalam pengembangan aplikasi web dari sisi frontend maupun
            backend. Fokus saya adalah membangun aplikasi yang terstruktur,
            responsive, mudah digunakan, dan mudah dikembangkan.
          </p>

          <motion.a
            href="/about"
            whileHover={
              prefersReducedMotion ? undefined : { x: 4 }
            }
            className="
              group
              mt-8
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-[#A855F7]
            "
          >
            <span>More about me</span>
            <span
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </motion.a>
        </motion.div>

        {/* =====================================================
            STATS
        ===================================================== */}

        <div
          className="
            grid
            grid-cols-2
            gap-x-8
            gap-y-10
          "
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={
                  prefersReducedMotion
                    ? undefined
                    : { opacity: 0, y: 16 }
                }
                animate={
                  isInView ? { opacity: 1, y: 0 } : undefined
                }
                transition={{
                  duration: 0.5,
                  delay: 0.1 + index * 0.08,
                  ease: "easeOut",
                }}
                className="relative"
              >
                <Icon
                  size={18}
                  strokeWidth={1.8}
                  style={{ color: stat.accent }}
                  className="mb-4"
                />

                <p
                  className="
                    text-3xl
                    font-semibold
                    tracking-tight
                    text-white
                    sm:text-4xl
                  "
                >
                  <AnimatedNumber
                    value={stat.value}
                    suffix={stat.suffix}
                    active={isInView}
                  />
                </p>

                <p
                  className="
                    mt-2
                    text-xs
                    text-white/40
                    sm:text-[13px]
                  "
                >
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}