"use client";

import { motion } from "framer-motion";

export default function TechBlocks() {
  const blocks = [
    { x: 12, y: 18, size: 10, accent: false },
    { x: 31, y: 18, size: 18, accent: true },
    { x: 58, y: 12, size: 12, accent: false },
    { x: 78, y: 25, size: 8, accent: false },

    { x: 20, y: 43, size: 8, accent: false },
    { x: 42, y: 38, size: 13, accent: false },
    { x: 68, y: 45, size: 18, accent: true },
    { x: 88, y: 52, size: 8, accent: false },

    { x: 10, y: 68, size: 16, accent: false },
    { x: 34, y: 63, size: 8, accent: true },
    { x: 55, y: 72, size: 12, accent: false },
    { x: 78, y: 68, size: 14, accent: false },

    { x: 22, y: 88, size: 8, accent: false },
    { x: 48, y: 88, size: 18, accent: true },
    { x: 75, y: 88, size: 9, accent: false },
  ];

  return (
    <div
      aria-hidden="true"
      className="relative flex min-h-[300px] items-center justify-center overflow-hidden"
    >
      {/* Main square */}
      <div className="relative h-[250px] w-[250px] sm:h-[300px] sm:w-[300px]">
        {/* Thin frame */}
        <div className="absolute inset-5 border border-white/[0.06]" />

        {/* Corner marks */}
        <span className="absolute left-0 top-0 h-8 w-px bg-white/20" />
        <span className="absolute left-0 top-0 h-px w-8 bg-white/20" />

        <span className="absolute bottom-0 right-0 h-8 w-px bg-white/20" />
        <span className="absolute bottom-0 right-0 h-px w-8 bg-white/20" />

        {/* SVG blocks */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
        >
          {/* Connecting lines */}
          <motion.path
            d="M31 27 L48 45 L68 54 L55 78 L48 88"
            fill="none"
            stroke="rgba(139,92,246,0.22)"
            strokeWidth="0.35"
            strokeDasharray="2 2"
            animate={{
              strokeDashoffset: [0, -20],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <motion.path
            d="M12 68 L34 63 L42 38 L58 12"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.3"
          />

          {blocks.map((block, index) => (
            <motion.rect
              key={index}
              x={block.x - block.size / 2}
              y={block.y - block.size / 2}
              width={block.size}
              height={block.size}
              rx="1"
              fill={
                block.accent
                  ? "rgba(139,92,246,0.16)"
                  : "rgba(255,255,255,0.025)"
              }
              stroke={
                block.accent
                  ? "rgba(139,92,246,0.55)"
                  : "rgba(255,255,255,0.09)"
              }
              strokeWidth="0.3"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={
                block.accent
                  ? {
                      opacity: [0.45, 0.9, 0.45],
                    }
                  : undefined
              }
              transition={{
                duration: 2.5,
                delay: index * 0.06,
                repeat: block.accent ? Infinity : 0,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>

        {/* Center node */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8B5CF6]"
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Technical label */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/20">
            System / 01
          </span>
        </div>
      </div>
    </div>
  );
}