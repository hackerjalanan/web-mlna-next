"use client";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Globe2,
  Server,
  ShieldCheck,
  Database,
  CreditCard,
  Cloud,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const architecture = [
  {
    title: "Client",
    subtitle: "Web / Mobile",
    icon: Globe2,
    color: "violet",
  },
  {
    title: "Next.js",
    subtitle: "Frontend",
    icon: Globe2,
    color: "violet",
  },
  {
    title: "REST API",
    subtitle: "API Layer",
    icon: Server,
    color: "red",
  },
  {
    title: "Node.js / Express",
    subtitle: "Backend",
    icon: Server,
    color: "emerald",
  },
  {
    title: "PostgreSQL / MySQL",
    subtitle: "Database",
    icon: Database,
    color: "blue",
  },
];

const capabilities = [
  {
    label: "REST API",
    icon: Server,
  },
  {
    label: "Authentication",
    icon: ShieldCheck,
  },
  {
    label: "Authorization",
    icon: ShieldCheck,
  },
  {
    label: "Database",
    icon: Database,
  },
  {
    label: "Payment Integration",
    icon: CreditCard,
  },
  {
    label: "Third-party API",
    icon: ArrowRight,
  },
  {
    label: "Deployment",
    icon: Cloud,
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};
export default function BackendShowcase() {
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-10">
      {/* Background decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-[#8B5CF6]/5 blur-[120px]" />
        <div className="absolute right-1/4 top-1/2 h-64 w-64 rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          {/* =====================================================
              LEFT CONTENT
          ===================================================== */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              margin: "-100px",
            }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <span className="mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#8B5CF6]">
                Backend Architecture
              </span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl"
            >
              I Build More Than
              <span className="block">
                Interfaces.
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-xl text-sm leading-7 text-white/55 sm:text-base"
            >
              Setiap interface membutuhkan sistem yang solid di
              belakangnya. Saya membangun backend yang terstruktur,
              aman, scalable, dan siap digunakan untuk kebutuhan
              production.
            </motion.p>

            {/* Capabilities */}
            <motion.div
              variants={containerVariants}
              className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3"
            >
              {capabilities.map((item) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.label}
                    variants={itemVariants}
                    whileHover={{
                      y: -3,
                      scale: 1.02,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 20,
                    }}
                    className="
                      group flex items-center gap-2
                      rounded-lg border border-white/10
                      bg-white/[0.025]
                      px-3 py-3
                      transition-colors
                      hover:border-[#8B5CF6]/30
                      hover:bg-white/[0.05]
                    "
                  >
                    <Icon
                      size={14}
                      className="text-white/40 transition-colors group-hover:text-[#8B5CF6]"
                    />

                    <span className="text-xs text-white/65">
                      {item.label}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Small status */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex items-center gap-2 text-xs text-white/40"
            >
              <CheckCircle2
                size={14}
                className="text-emerald-400"
              />

              <span>
                Designed for reliability & scalability
              </span>
            </motion.div>
          </motion.div>

          {/* =====================================================
              RIGHT ARCHITECTURE
          ===================================================== */}
          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
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
            className="relative"
          >
            <div
              className="
                relative overflow-hidden
                rounded-2xl
                border border-white/10
                bg-[#080808]
                p-5
                shadow-2xl
                sm:p-8
              "
            >
              {/* Grid */}
              <div
                aria-hidden
                className="
                  pointer-events-none absolute inset-0
                  opacity-[0.035]
                  [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)]
                  [background-size:32px_32px]
                "
              />

              {/* Top bar */}
              <div className="relative mb-8 flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>

                  <span className="ml-2 font-mono text-[10px] text-white/30">
                    backend.architecture
                  </span>
                </div>

                <span className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400/70">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  SYSTEM ONLINE
                </span>
              </div>

              {/* Architecture */}
              <div className="relative">
                <div className="grid gap-3 sm:grid-cols-5 sm:items-center sm:gap-0">
                  {architecture.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="relative flex items-center sm:block"
                      >
                        {/* Node */}
                        <motion.div
                          initial={{
                            opacity: 0,
                            scale: 0.8,
                          }}
                          whileInView={{
                            opacity: 1,
                            scale: 1,
                          }}
                          viewport={{
                            once: true,
                          }}
                          transition={{
                            delay: 0.15 + index * 0.12,
                            duration: 0.4,
                          }}
                          whileHover={{
                            y: -5,
                            scale: 1.04,
                          }}
                          className="
                            group relative z-10
                            w-full
                            rounded-xl
                            border border-white/10
                            bg-[#0d0d0d]
                            p-4
                            transition-colors
                            hover:border-white/20
                            sm:mx-auto
                            sm:w-[150px]
                          "
                        >
                          {/* Glow */}
                          <div
                            aria-hidden
                            className="
                              pointer-events-none
                              absolute inset-0
                              rounded-xl
                              opacity-0
                              blur-xl
                              transition-opacity
                              group-hover:opacity-100
                            "
                          />

                          <div className="relative">
                            <div className="mb-3 flex items-center justify-between">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                                <Icon
                                  size={17}
                                  className="text-white/70"
                                />
                              </div>

                              <span className="font-mono text-[9px] text-white/20">
                                0{index + 1}
                              </span>
                            </div>

                            <div className="text-xs font-medium text-white/90">
                              {item.title}
                            </div>

                            <div className="mt-1 text-[10px] text-white/35">
                              {item.subtitle}
                            </div>
                          </div>
                        </motion.div>

                        {/* Connection */}
                        {index < architecture.length - 1 && (
                          <div
                            aria-hidden
                            className="
                              relative
                              mx-3
                              h-px
                              flex-1
                              bg-white/10
                              sm:absolute
                              sm:left-[calc(50%+75px)]
                              sm:top-1/2
                              sm:block
                              sm:w-[calc(100%-150px)]
                              sm:translate-y-[-50%]
                            "
                          >
                            {/* Animated data packet */}
                            <motion.span
                              initial={{
                                left: "0%",
                                opacity: 0,
                              }}
                              whileInView={{
                                left: "100%",
                                opacity: [0, 1, 1, 0],
                              }}
                              viewport={{
                                once: false,
                              }}
                              transition={{
                                duration: 2,
                                delay: 0.8 + index * 0.3,
                                repeat: Infinity,
                                repeatDelay: 1,
                                ease: "linear",
                              }}
                              className="
                                absolute
                                top-1/2
                                h-1.5
                                w-1.5
                                -translate-y-1/2
                                rounded-full
                                bg-[#8B5CF6]
                                shadow-[0_0_12px_rgba(139,92,246,0.9)]
                              "
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom metrics */}
              <div className="relative mt-8 grid grid-cols-3 gap-2 border-t border-white/10 pt-6">
                <Metric
                  value="REST"
                  label="API"
                />

                <Metric
                  value="JWT"
                  label="Auth"
                />

                <Metric
                  value="SQL"
                  label="Database"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Metric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-3"
    >
      <div className="font-mono text-xs font-medium text-white/80">
        {value}
      </div>

      <div className="mt-1 text-[10px] text-white/30">
        {label}
      </div>
    </motion.div>
  );
}
