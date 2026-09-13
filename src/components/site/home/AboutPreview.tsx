"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Layers,
  Lock,
  ShieldCheck,
} from "lucide-react";

const points = [
  {
    icon: Layers,
    title: "Architecture That Scales",
    description:
      "Membangun struktur backend, API, dan database yang rapi agar sistem mudah dikembangkan.",
    color: "purple",
  },
  {
    icon: Lock,
    title: "Secure by Design",
    description:
      "Authentication, authorization, JWT, dan RBAC dirancang untuk menjaga keamanan data.",
    color: "red",
  },
  {
    icon: ShieldCheck,
    title: "Stable & Maintainable",
    description:
      "Fokus pada code yang terstruktur, performa yang baik, dan sistem yang mudah dirawat.",
    color: "green",
  },
] as const;

const colorStyles = {
  purple: {
    icon: "text-purple-400",
    glow: "bg-purple-500/10",
  },
  red: {
    icon: "text-red-400",
    glow: "bg-red-500/10",
  },
  green: {
    icon: "text-emerald-400",
    glow: "bg-emerald-500/10",
  },
};

export default function AboutPreview() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#050505]
        px-4
        py-24
        sm:px-6
        lg:px-10
      "
    >
      <div
        className="
          mx-auto
          grid
          max-w-[1200px]
          items-center
          gap-16
          lg:grid-cols-[0.9fr_1.1fr]
          lg:gap-24
        "
      >
        {/* =================================
            LEFT — VISUAL
        ================================= */}
        <motion.div
          initial={
            prefersReducedMotion
              ? undefined
              : {
                  opacity: 0,
                  x: -30,
                }
          }
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
            margin: "-100px",
          }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="
            relative
            flex
            min-h-[360px]
            items-center
            justify-center
          "
        >
          {/* Soft ambient light */}
          <div
            aria-hidden
            className="
              pointer-events-none
              absolute
              h-64
              w-64
              rounded-full
              bg-purple-500/[0.05]
              blur-3xl
            "
          />

          {/* Stack */}
          <div className="relative h-[300px] w-[340px]">
            {/* Layer 1 */}
            <motion.div
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      y: [0, -5, 0],
                    }
              }
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                absolute
                left-1/2
                top-2
                flex
                h-32
                w-64
                -translate-x-1/2
                -rotate-[18deg]
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.035]
                shadow-[0_20px_50px_rgba(0,0,0,0.35)]
              "
            >
              <Layers
                size={58}
                strokeWidth={1.3}
                className="text-purple-400"
              />
            </motion.div>

            {/* Layer 2 */}
            <motion.div
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      y: [0, 6, 0],
                    }
              }
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
              className="
                absolute
                left-1/2
                top-[90px]
                flex
                h-32
                w-64
                -translate-x-1/2
                -rotate-[18deg]
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.03]
                shadow-[0_20px_50px_rgba(0,0,0,0.35)]
              "
            >
              <Lock
                size={56}
                strokeWidth={1.3}
                className="text-red-400"
              />
            </motion.div>

            {/* Layer 3 */}
            <motion.div
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      y: [0, -4, 0],
                    }
              }
              transition={{
                duration: 5.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6,
              }}
              className="
                absolute
                left-1/2
                top-[178px]
                flex
                h-32
                w-64
                -translate-x-1/2
                -rotate-[18deg]
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.025]
                shadow-[0_20px_50px_rgba(0,0,0,0.4)]
              "
            >
              <ShieldCheck
                size={56}
                strokeWidth={1.3}
                className="text-emerald-400"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* =================================
            RIGHT — CONTENT
        ================================= */}
        <div>
          {/* Section label */}
          <motion.div
            initial={
              prefersReducedMotion
                ? undefined
                : {
                    opacity: 0,
                    y: 10,
                  }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
            }}
            className="mb-8"
          >
           
          </motion.div>

          {/* Points */}
          <div className="space-y-12">
            {points.map((point, index) => {
              const Icon = point.icon;
              const style = colorStyles[point.color];

              return (
                <motion.div
                  key={point.title}
                  initial={
                    prefersReducedMotion
                      ? undefined
                      : {
                          opacity: 0,
                          x: 25,
                        }
                  }
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                    margin: "-80px",
                  }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  className="
                    group
                    relative
                    flex
                    gap-5
                  "
                >
                  {/* Icon */}
                  <motion.div
                    whileHover={
                      prefersReducedMotion
                        ? undefined
                        : {
                            scale: 1.08,
                          }
                    }
                    className="
                      relative
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                    "
                  >
                    {/* subtle glow */}
                    <span
                      className={`
                        absolute
                        inset-0
                        rounded-full
                        opacity-0
                        blur-xl
                        transition-opacity
                        duration-300
                        group-hover:opacity-100
                        ${style.glow}
                      `}
                    />

                    <Icon
                      size={25}
                      strokeWidth={1.5}
                      className={`
                        relative
                        ${style.icon}
                      `}
                    />
                  </motion.div>

                  {/* Text */}
                  <div className="max-w-xl">
                    <h3
                      className="
                        text-xl
                        font-semibold
                        tracking-tight
                        text-white
                        sm:text-2xl
                      "
                    >
                      {point.title}
                    </h3>

                    <p
                      className="
                        mt-2
                        text-sm
                        leading-6
                        text-white/50
                        sm:text-[15px]
                      "
                    >
                      {point.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}