"use client";

import { ArrowUpRight, MessageCircle } from "lucide-react";
import { motion, useReducedMotion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState, type PointerEvent } from "react";

type Line =
  | { kind: "command"; text: string }
  | { kind: "output"; text: string }
  | { kind: "status"; text: string }
  | { kind: "gap" };

const SCRIPT: Line[] = [
  { kind: "command", text: "whoami" },
  { kind: "output", text: "ade@developer" },
  { kind: "gap" },
  { kind: "command", text: "stack" },
  { kind: "output", text: "Node.js" },
  { kind: "output", text: "Express" },
  { kind: "output", text: "Next.js" },
  { kind: "output", text: "PostgreSQL" },
  { kind: "output", text: "MySQL" },
  { kind: "output", text: "Supabase" },
  { kind: "gap" },
  { kind: "command", text: "status" },
  { kind: "status", text: "Available for projects" },
];

/**
 * Terminal card — types the command lines character by character,
 * reveals output lines with a quick fade. Skips straight to the
 * finished state if the user prefers reduced motion.
 */
function TerminalWindow() {
  const prefersReducedMotion = useReducedMotion();
  const [revealed, setRevealed] = useState<number>(
    prefersReducedMotion ? SCRIPT.length : 0
  );
  const [typedChars, setTypedChars] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Soft spotlight that follows the cursor across the terminal — no zoom, no neon.
  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(200px circle at ${spotX}px ${spotY}px, rgba(139,92,246,0.10), transparent 75%)`;

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    spotX.set(e.clientX - rect.left);
    spotY.set(e.clientY - rect.top);
  };

  useEffect(() => {
    if (prefersReducedMotion) return;

    function step(lineIndex: number, charIndex: number) {
      if (lineIndex >= SCRIPT.length) return;
      const line = SCRIPT[lineIndex];

      if (line.kind === "command") {
        if (charIndex <= line.text.length) {
          setTypedChars(charIndex);
          timeoutRef.current = setTimeout(
            () => step(lineIndex, charIndex + 1),
            45
          );
          return;
        }
      }

      setRevealed(lineIndex + 1);
      setTypedChars(0);
      const delay = line.kind === "gap" ? 120 : line.kind === "command" ? 260 : 160;
      timeoutRef.current = setTimeout(() => step(lineIndex + 1, 0), delay);
    }

    step(0, 0);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  return (
    <motion.div
      onPointerMove={handlePointerMove}
      animate={prefersReducedMotion ? undefined : { y: [0, -6, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
    >
      {/* Cursor-follow spotlight, very subtle purple, no glow shadow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: spotlight }}
      />

      {/* Title bar */}
      <div className="relative flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-3 text-[11px] text-white/40">terminal — zsh</span>
      </div>

      {/* Body */}
      <div className="relative min-h-[220px] px-4 py-4 font-mono text-[13px] leading-6">
        {SCRIPT.map((line, index) => {
          if (index > revealed) return null;
          const isCurrent = index === revealed && !prefersReducedMotion;

          if (line.kind === "gap") return <div key={index} className="h-2" />;

          if (line.kind === "command") {
            const text = isCurrent ? line.text.slice(0, typedChars) : line.text;
            return (
              <div key={index} className="flex items-center gap-2">
                <span className="text-[#8B5CF6]">$</span>
                <span className="text-white/90">{text}</span>
                {isCurrent && (
                  <span className="inline-block h-3.5 w-[7px] animate-pulse bg-[#8B5CF6]/80" />
                )}
              </div>
            );
          }

          if (line.kind === "status") {
            return (
              <div key={index} className="mt-1 flex items-center gap-2 text-white/80">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]" />
                </span>
                {line.text}
              </div>
            );
          }

          return (
            <div key={index} className="pl-4 text-white/50">
              {line.text}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden">
      {/* Subtle grid, purely decorative — no gradient color, just faded lines */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0 -z-10
          bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)]
          bg-[size:64px_64px]
          [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_40%,transparent_100%)]
        "
      />

      <div className="mx-auto flex min-h-[92vh] max-w-[1440px] flex-col justify-center px-4 py-20 sm:px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text column */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Status badge instead of plain eyebrow text */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10B981]" />
              </span>
              <span className="text-xs font-medium text-white/60">
                Available for freelance & full-time
              </span>
            </div>

            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
              Building Digital Products
              <br />
              That Actually{" "}
              <span className="text-[#8B5CF6]">Work.</span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/50 sm:text-base">
              Saya membangun aplikasi web, REST API, dan backend system yang
              scalable, aman, dan mudah dikembangkan, mulai dari database dan
              authentication hingga tampilan yang siap dipakai pengguna.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <motion.a
                href="/projects"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="
                  flex items-center gap-1.5 rounded-lg bg-[#8B5CF6] px-5 py-3
                  text-sm font-semibold text-white transition-colors
                  hover:bg-[#A855F7]
                "
              >
                View Projects
                <ArrowUpRight size={16} />
              </motion.a>

              <motion.a
                href="/contact"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="
                  flex items-center gap-1.5 rounded-lg border border-white/15
                  px-5 py-3 text-sm font-semibold text-white/70
                  transition-colors hover:border-white/30 hover:text-white
                "
              >
                Let&apos;s Work Together
                <MessageCircle size={16} />
              </motion.a>
            </div>
          </motion.div>

          {/* Terminal column */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="flex justify-center lg:justify-end"
          >
            <TerminalWindow />
          </motion.div>
        </div>
      </div>

      {/* Scroll cue — subtle, floats gently, disappears once scrolled isn't tracked here to keep it simple */}
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
        >
          <span className="text-[10px] uppercase tracking-widest text-white/30">Scroll</span>
          <div className="h-8 w-px bg-white/15" />
        </motion.div>
      )}
    </section>
  );
}