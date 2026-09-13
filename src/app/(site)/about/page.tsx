"use client";

import TechBlocks from "@/components/site/about/TechBlocks";

import Image from "next/image";
import {
  Code2,
  Database,
  Server,
  Palette,
  BriefcaseBusiness,
} from "lucide-react";


import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiPhp,
  SiLaravel,
  SiMysql,
  SiPostgresql,
  SiTailwindcss,
  SiGit,
  SiPython,
  SiFlask,
  SiDart,
  SiFlutter,
  SiDocker,
  SiVite,
  SiWebpack,
  SiRedux,
  SiPostman,
  SiFigma,
} from "react-icons/si";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

import {
  useEffect,
  useRef,
  type PointerEvent,
  type ReactNode,
} from "react";

// =====================================================
// DATA
// =====================================================

const skills = [
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "React.js", icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" },
  { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
  { name: "Express.js", icon: SiExpress, color: "#FFFFFF" },
  { name: "PHP", icon: SiPhp, color: "#777BB4" },
  { name: "Laravel", icon: SiLaravel, color: "#FF2D20" },
  { name: "MySQL", icon: SiMysql, color: "#4479A1" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Git", icon: SiGit, color: "#F05032" },
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "Flask", icon: SiFlask, color: "#FFFFFF" },
  { name: "Dart", icon: SiDart, color: "#0175C2" },
  { name: "Flutter", icon: SiFlutter, color: "#02569B" },
  { name: "Docker", icon: SiDocker, color: "#2496ED" },
  { name: "Vite", icon: SiVite, color: "#646CFF" },
  { name: "Webpack", icon: SiWebpack, color: "#8DD6F9" },
  { name: "Redux", icon: SiRedux, color: "#764ABC" },
  { name: "Postman", icon: SiPostman, color: "#FF6C37" },
  { name: "Figma", icon: SiFigma, color: "#F24E1E" },
];

const services = [
  {
    title: "Frontend Development",
    description:
      "Membangun interface web yang responsive, terstruktur, dan nyaman digunakan menggunakan React.js, Next.js, dan Tailwind CSS.",
    icon: Code2,
    color: "#8B5CF6",
  },
  {
    title: "Backend Development",
    description:
      "Mengembangkan REST API, business logic, authentication, dan integrasi sistem menggunakan Node.js, Express.js, dan Laravel.",
    icon: Server,
    color: "#EF4444",
  },
  {
    title: "Database",
    description:
      "Merancang struktur database, membuat query, melakukan maintenance, dan mengelola data aplikasi menggunakan MySQL dan PostgreSQL.",
    icon: Database,
    color: "#10B981",
  },
  {
    title: "UI Implementation",
    description:
      "Mengubah desain menjadi interface web yang responsive dan konsisten dengan memperhatikan detail layout serta usability.",
    icon: Palette,
    color: "#3B82F6",
  },
];

const experiences = [
  {
    role: "Fullstack Programmer",
    company: "PT. Gama Integra Informatika",
    period: "2024 — 2025",
    description:
      "Mengembangkan dan melakukan maintenance aplikasi web, mengelola database, membangun fitur, melakukan troubleshooting, serta bekerja dengan backend.",
  },
  {
    role: "Freelance Developer & Designer",
    company: "Independent",
    period: "2024 — Present",
    description:
      "Mengerjakan berbagai kebutuhan website dan interface, mulai dari pengembangan aplikasi, implementasi desain, hingga maintenance.",
  },
];

// =====================================================
// SHARED: SCROLL REVEAL
// =====================================================

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// =====================================================
// SHARED: TILT CARD
// =====================================================
function TiltCard({
  children,
  accent,
  className,
}: {
  children: ReactNode;
  accent: string;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);

  const springConfig = {
    stiffness: 220,
    damping: 22,
    mass: 0.5,
  };

  // =========================
  // 3D TILT
  // =========================

  const rotateX = useSpring(
    useTransform(
      pointerY,
      [-0.5, 0.5],
      [6, -6]
    ),
    springConfig
  );

  const rotateY = useSpring(
    useTransform(
      pointerX,
      [-0.5, 0.5],
      [-6, 6]
    ),
    springConfig
  );

  // =========================
  // CURSOR RGB
  // =========================

  const rgbGlow = useMotionTemplate`
    radial-gradient(
      180px circle at ${glowX}px ${glowY}px,
      rgba(139, 92, 246, 0.95),
      rgba(59, 130, 246, 0.55) 32%,
      rgba(239, 68, 68, 0.45) 52%,
      transparent 75%
    )
  `;

  const cursorGlow = useMotionTemplate`
    radial-gradient(
      120px circle at ${glowX}px ${glowY}px,
      rgba(139, 92, 246, 0.18),
      rgba(59, 130, 246, 0.10) 35%,
      rgba(239, 68, 68, 0.06) 55%,
      transparent 75%
    )
  `;

  // =========================
  // POINTER MOVE
  // =========================

  const handlePointerMove = (
    e: PointerEvent<HTMLDivElement>
  ) => {
    if (
      prefersReducedMotion ||
      e.pointerType === "touch"
    ) {
      return;
    }

    const rect =
      e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    pointerX.set(
      x / rect.width - 0.5
    );

    pointerY.set(
      y / rect.height - 0.5
    );

    glowX.set(x);
    glowY.set(y);
  };

  // =========================
  // POINTER LEAVE
  // =========================

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.div
      className={`group relative ${className ?? ""}`}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* RGB BORDER */}
      <motion.div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -inset-px
          z-0
          rounded-[inherit]
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
        style={{
          background: rgbGlow,
        }}
      />

      {/* BLACK INNER SURFACE */}
      <div
        className="
          absolute
          inset-px
          z-[1]
          rounded-[inherit]
          bg-[#050505]
        "
      />

      {/* CURSOR DISTORTION / GLOW */}
      <motion.div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-[2]
          rounded-[inherit]
          opacity-0
          blur-xl
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
        style={{
          background: cursorGlow,
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

// =====================================================
// DOTTED BRAND MARK
// =====================================================

function DottedBrandMark() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const prefersReducedMotion = useReducedMotion();

  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);

  const glow = useMotionTemplate`
    radial-gradient(
      320px circle at ${glowX}px ${glowY}px,
      rgba(255,255,255,0.35),
      transparent 70%
    )
  `;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let resizeObserver: ResizeObserver | null = null;
    let cancelled = false;

    const draw = () => {
      if (cancelled) return;

      const rect = container.getBoundingClientRect();

      if (rect.width <= 0 || rect.height <= 0) {
        return;
      }

      // =================================================
      // Gunakan ukuran integer agar koordinat canvas
      // konsisten dan tidak menyebabkan flicker.
      // =================================================

      const width = Math.round(rect.width);
      const height = Math.round(rect.height);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // =================================================
      // OFFSCREEN CANVAS
      // =================================================

      const off = document.createElement("canvas");

      off.width = width;
      off.height = height;

      const offCtx = off.getContext("2d", {
        willReadFrequently: true,
      });

      if (!offCtx) return;

      offCtx.clearRect(0, 0, width, height);

      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillStyle = "#ffffff";

      // =================================================
      // FONT SIZE STABIL
      // =================================================

      const maxWidth = width * 0.8;
      const maxHeight = height * 0.55;

      let fontSize = Math.min(
        height * 0.5,
        maxHeight
      );

      const setFont = (size: number) => {
        offCtx.font = `600 ${size}px "Cinzel", serif`;
      };

      setFont(fontSize);

      let textWidth = offCtx.measureText("AD.EM").width;

      // Scale hanya sekali berdasarkan ukuran final.
      if (textWidth > maxWidth && textWidth > 0) {
        fontSize = fontSize * (maxWidth / textWidth);
        setFont(fontSize);
      }

      // Safety check kedua untuk font yang sangat berbeda
      // ketika fallback font digunakan.
      textWidth = offCtx.measureText("AD.EM").width;

      if (textWidth > maxWidth && textWidth > 0) {
        fontSize = fontSize * (maxWidth / textWidth);
        setFont(fontSize);
      }

      // =================================================
      // DRAW TEXT
      // =================================================

      offCtx.fillText(
        "AD.EM",
        width / 2,
        height / 2
      );

      // =================================================
      // READ PIXELS
      // =================================================

      const imageData = offCtx.getImageData(
        0,
        0,
        width,
        height
      );

      const data = imageData.data;

      // =================================================
      // DOT SETTINGS
      // =================================================

      const spacing = 5;
      const dotRadius = 0.9;

      ctx.fillStyle = "rgba(255,255,255,0.18)";

      // =================================================
      // BUILD DOTS
      // =================================================

      for (let y = 0; y < height; y += spacing) {
        for (let x = 0; x < width; x += spacing) {
          const pixelX = Math.min(
            Math.floor(x),
            width - 1
          );

          const pixelY = Math.min(
            Math.floor(y),
            height - 1
          );

          const idx =
            (pixelY * width + pixelX) * 4;

          const alpha = data[idx + 3];

          if (alpha > 128) {
            ctx.beginPath();

            ctx.arc(
              x,
              y,
              dotRadius,
              0,
              Math.PI * 2
            );

            ctx.fill();
          }
        }
      }
    };

    // ===================================================
    // IMPORTANT:
    // Tunggu font selesai dimuat sebelum melakukan
    // measureText().
    // Ini bagian utama untuk menghilangkan flicker.
    // ===================================================

    const initialize = async () => {
      try {
        if (document.fonts?.ready) {
          await document.fonts.ready;
        }
      } catch {
        // fallback tetap lanjut
      }

      if (cancelled) return;

      draw();

      resizeObserver = new ResizeObserver(() => {
        draw();
      });

      resizeObserver.observe(container);
    };

    initialize();

    return () => {
      cancelled = true;

      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  // =====================================================
  // POINTER GLOW
  // =====================================================

  const handlePointerMove = (
    e: PointerEvent<HTMLDivElement>
  ) => {
    if (
      prefersReducedMotion ||
      e.pointerType === "touch"
    ) {
      return;
    }

    const rect =
      e.currentTarget.getBoundingClientRect();

    glowX.set(e.clientX - rect.left);
    glowY.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="
        relative
        h-[220px]
        w-full
        overflow-hidden
        rounded-xl
        border
        border-white/10
        bg-white/[0.02]
        sm:h-[280px]
        lg:h-[340px]
      "
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />

      {!prefersReducedMotion && (
        <motion.div
          aria-hidden
          style={{
            background: glow,
            mixBlendMode: "overlay",
          }}
          className="
            pointer-events-none
            absolute
            inset-0
          "
        />
      )}

      <span
        className="
          absolute
          left-5
          top-5
          text-xs
          font-medium
          tracking-wide
          text-white/50
        "
      />
    </div>
  );
}

// =====================================================
// PAGE
// =====================================================

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050505]">
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10">

        {/* =================================================
            DOTTED BRAND MARK + HEADER
        ================================================= */}

        <section className="mb-16">
          <Reveal>
            <DottedBrandMark />
          </Reveal>

          <div className="mt-8 grid gap-10 md:grid-cols-[auto_1fr] md:items-center">
            <Reveal delay={0.05}>
              <div className="relative h-28 w-28 overflow-hidden rounded-full border border-white/10 sm:h-32 sm:w-32">
                <Image
                  src="/image/profile/ademlna-pf.png"
                  alt="Ade Maulana Hidayah"
                  fill
                  sizes="128px"
                  className="object-cover"
                  priority
                />
              </div>
            </Reveal>

            <Reveal
              delay={0.1}
              className="max-w-2xl"
            >
              <p className="mb-3 text-sm font-medium text-[#8B5CF6]">
                ABOUT ME
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Ade Maulana Hidayah
              </h1>

              <p className="mt-4 text-base leading-7 text-white/50 sm:text-lg">
                Saya Ade Maulana Hidayah, seorang programmer
                dengan fokus pada pengembangan aplikasi web
                dan pengalaman di sisi frontend maupun backend.
              </p>
            </Reveal>
          </div>
        </section>

        {/* =================================================
            PROFILE
        ================================================= */}

        <section className="mb-24 grid gap-12 md:grid-cols-[1.15fr_0.85fr] md:items-center">
          <Reveal>
            <div className="max-w-2xl">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8B5CF6]">
                01 / Profile
              </p>

              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                A Little About Me
              </h2>

              <div className="mt-6 space-y-4 text-sm leading-7 text-white/50 sm:text-base">
                <p>
                  I have a background in Information Systems
                  with a strong interest in software development,
                  especially modern web applications.
                </p>

                <p>
                  I work across the frontend and backend,
                  building REST APIs, managing databases,
                  implementing authentication, and maintaining
                  reliable web applications.
                </p>

                <p>
                  I enjoy turning ideas and business requirements
                  into structured, practical, and maintainable
                  digital solutions.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <TechBlocks />
          </Reveal>
        </section>

        {/* =================================================
            QUICK INFORMATION
        ================================================= */}

        <section className="mb-24 grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-center">
          <Reveal>
            <div className="hidden md:block">
              <div className="relative h-[260px] overflow-hidden border border-white/[0.06]">
                <div
                  className="
                    absolute
                    inset-0
                    opacity-30
                    [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]
                    [background-size:32px_32px]
                  "
                />

                <motion.div
                  className="absolute left-[20%] top-[25%] h-16 w-16 border border-[#8B5CF6]/30 bg-[#8B5CF6]/10"
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <motion.div
                  className="absolute right-[18%] top-[45%] h-24 w-24 border border-white/10 bg-white/[0.02]"
                  animate={{
                    y: [0, 8, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <motion.div
                  className="absolute bottom-[15%] left-[42%] h-8 w-8 border border-[#10B981]/30 bg-[#10B981]/10"
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <div className="absolute bottom-4 left-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/20">
                    Developer / 02
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mx-auto w-full max-w-md text-center md:ml-auto md:mr-0 md:text-left md:pr-6 lg:pr-10">
              <div className="mb-7">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8B5CF6]">
                  02 / Information
                </p>

                <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Quick Information
                </h2>
              </div>

              <div className="divide-y divide-white/[0.07]">
                {[
                  {
                    label: "Education",
                    value: "S1 Information Systems",
                  },
                  {
                    label: "Role",
                    value: "Fullstack Programmer",
                  },
                  {
                    label: "Focus",
                    value: "Web Development",
                  },
                ].map((info) => (
                  <div
                    key={info.label}
                    className="py-4 first:pt-0 last:pb-4"
                  >
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                      {info.label}
                    </p>

                    <p className="mt-1.5 text-sm text-white/80 sm:text-base">
                      {info.value}
                    </p>
                  </div>
                ))}

                <div className="pt-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                    Availability
                  </p>

                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-50" />

                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]" />
                    </span>

                    <span className="text-sm text-[#10B981] sm:text-base">
                      Open to opportunities
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* =================================================
            WHAT I DO
        ================================================= */}

        <section className="mb-20">
          <Reveal className="mb-8">
            <p className="text-xs text-[#8B5CF6]">
              SERVICES
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              What I Do
            </h2>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <Reveal
                  key={service.title}
                  delay={index * 0.08}
                >
                  <TiltCard accent={service.color}>
                    {/* RGB Border Glow */}
                    <div
                      className="
                        pointer-events-none
                        absolute
                        -inset-px
                        rounded-[inherit]
                        opacity-0
                        transition-opacity
                        duration-300
                        group-hover:opacity-100
                      "
                      style={{
                        background: `
                          radial-gradient(
                            180px circle at var(--mouse-x) var(--mouse-y),
                            ${service.color}f2,
                            rgba(59, 130, 246, 0.45) 30%,
                            rgba(239, 68, 68, 0.35) 50%,
                            transparent 75%
                          )
                        `,
                      }}
                    />

                    {/* Inner Black Surface */}
                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-px
                        rounded-[inherit]
                        bg-[#050505]
                      "
                    />

                    {/* Cursor Distortion / Ripple */}
                    <div
                      className="
                        pointer-events-none
                        absolute
                        h-32
                        w-32
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        opacity-0
                        blur-xl
                        transition-opacity
                        duration-300
                        group-hover:opacity-100
                      "
                      style={{
                        left: "var(--mouse-x)",
                        top: "var(--mouse-y)",
                        background: `
                          radial-gradient(
                            circle,
                            ${service.color}2e 0%,
                            rgba(59, 130, 246, 0.10) 35%,
                            rgba(239, 68, 68, 0.06) 55%,
                            transparent 75%
                          )
                        `,
                        transform:
                          "translate(-50%, -50%) scale(1.15)",
                      }}
                    />

                    {/* RGB Shadow */}
                    <div
                      className="
                        pointer-events-none
                        absolute
                        -inset-2
                        -z-10
                        rounded-[inherit]
                        opacity-0
                        blur-xl
                        transition-opacity
                        duration-500
                        group-hover:opacity-70
                      "
                      style={{
                        background: `
                          radial-gradient(
                            220px circle at var(--mouse-x) var(--mouse-y),
                            ${service.color}59,
                            rgba(59, 130, 246, 0.18) 35%,
                            rgba(239, 68, 68, 0.14) 55%,
                            transparent 75%
                          )
                        `,
                      }}
                    />

                    {/* Content */}
                    <div className="relative z-10 p-5">
                      {/* Icon */}
                      <div
                        className="
                          mb-5
                          flex
                          h-11
                          w-11
                          items-center
                          justify-center
                          border
                          border-white/[0.06]
                          bg-[#050505]
                          transition-all
                          duration-300
                        "
                        style={{
                          color: service.color,
                        }}
                      >
                        <Icon size={20} />
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-semibold text-white">
                        {service.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-2 text-sm leading-6 text-white/45">
                        {service.description}
                      </p>
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* =================================================
            SKILLS
        ================================================= */}

        <section className="mb-20">
          <Reveal className="mb-8">
            <p className="text-xs text-[#8B5CF6]">
              TECHNOLOGIES
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              Technical Skills
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {skills.map((skill, index) => {
              const Icon = skill.icon;

              return (
                <Reveal
                  key={skill.name}
                  delay={Math.min(index * 0.03, 0.4)}
                >
                  <SkillTile
                    name={skill.name}
                    icon={Icon}
                    color={skill.color}
                  />
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* =================================================
            EXPERIENCE
        ================================================= */}

        <section className="mb-20">
          <Reveal className="mb-8">
            <p className="text-xs text-[#8B5CF6]">
              EXPERIENCE
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              Work Experience
            </h2>
          </Reveal>

          <div className="space-y-4">
            {experiences.map((experience, index) => (
              <Reveal
                key={`${experience.role}-${experience.company}`}
                delay={index * 0.08}
              >
               <TiltCard accent="#8B5CF6">
                {/* RGB Border Glow */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    -inset-px
                    rounded-[inherit]
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                  "
                  style={{
                    background: `
                      radial-gradient(
                        180px circle at var(--mouse-x) var(--mouse-y),
                        rgba(139, 92, 246, 0.95),
                        rgba(59, 130, 246, 0.45) 30%,
                        rgba(239, 68, 68, 0.35) 50%,
                        transparent 75%
                      )
                    `,
                  }}
                />

                {/* Inner Black Surface */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-px
                    rounded-[inherit]
                    bg-[#050505]
                  "
                />

                {/* Cursor Distortion / Ripple */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    h-32
                    w-32
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    opacity-0
                    blur-xl
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                  "
                  style={{
                    left: "var(--mouse-x)",
                    top: "var(--mouse-y)",
                    background: `
                      radial-gradient(
                        circle,
                        rgba(139, 92, 246, 0.18) 0%,
                        rgba(59, 130, 246, 0.10) 35%,
                        rgba(239, 68, 68, 0.06) 55%,
                        transparent 75%
                      )
                    `,
                    transform: "translate(-50%, -50%) scale(1.15)",
                  }}
                />

                {/* RGB Shadow */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    -inset-2
                    -z-10
                    rounded-[inherit]
                    opacity-0
                    blur-xl
                    transition-opacity
                    duration-500
                    group-hover:opacity-70
                  "
                  style={{
                    background: `
                      radial-gradient(
                        220px circle at var(--mouse-x) var(--mouse-y),
                        rgba(139, 92, 246, 0.35),
                        rgba(59, 130, 246, 0.18) 35%,
                        rgba(239, 68, 68, 0.14) 55%,
                        transparent 75%
                      )
                    `,
                  }}
                />

                {/* Content */}
                <div className="relative z-10 flex gap-4">
                  {/* Icon */}
                  <div
                    className="
                      hidden
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      border
                      border-white/[0.06]
                      bg-[#050505]
                      text-[#8B5CF6]
                      transition-all
                      duration-300
                      group-hover:border-[#8B5CF6]/30
                      group-hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]
                      sm:flex
                    "
                  >
                    <BriefcaseBusiness size={19} />
                  </div>

                  {/* Experience Information */}
                  <div className="min-w-0">
                    {/* Role + Period */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-white">
                        {experience.role}
                      </h3>

                      <span className="text-xs text-white/30">
                        •
                      </span>

                      <span className="text-sm text-[#8B5CF6]">
                        {experience.period}
                      </span>
                    </div>

                    {/* Company */}
                    <p className="mt-1 text-sm text-white/40">
                      {experience.company}
                    </p>

                    {/* Description */}
                    <p className="mt-3 text-sm leading-6 text-white/50">
                      {experience.description}
                    </p>
                  </div>
                </div>
              </TiltCard>
              </Reveal>
            ))}
          </div>
        </section>

        {/* =================================================
            VALUES
        ================================================= */}

        <Reveal className="border-t border-white/10 pt-12">
          <div className="max-w-3xl">
            <p className="text-xs text-[#8B5CF6]">
              WORKING PRINCIPLES
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              How I Work
            </h2>

            <div className="mt-5 space-y-3 text-base leading-7 text-white/50">
              <p>
                Saya berfokus membangun aplikasi dengan struktur
                kode yang rapi, efisien, dan mudah dikembangkan
                untuk kebutuhan jangka panjang.
              </p>

              <p>
                Terbiasa melakukan analisis masalah, debugging,
                membaca dokumentasi, menggunakan Git dalam
                workflow pengembangan, senang mengeksplorasi
                teknologi baru untuk meningkatkan kualitas setiap
                project yang dikerjakan.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}

// =====================================================
// SKILL TILE
// =====================================================

function SkillTile({
  name,
  icon: Icon,
  color,
}: {
  name: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
    style?: React.CSSProperties;
  }>;
  color: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const springConfig = {
    stiffness: 250,
    damping: 20,
  };

  const rotateX = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [8, -8]),
    springConfig
  );

  const rotateY = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [-8, 8]),
    springConfig
  );

  const handlePointerMove = (
    e: PointerEvent<HTMLDivElement>
  ) => {
    if (
      prefersReducedMotion ||
      e.pointerType === "touch"
    ) {
      return;
    }

    const rect =
      e.currentTarget.getBoundingClientRect();

    pointerX.set(
      (e.clientX - rect.left) / rect.width - 0.5
    );

    pointerY.set(
      (e.clientY - rect.top) / rect.height - 0.5
    );
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 500,
      }}
      className="
        group
        flex
        h-16
        items-center
        gap-3
        rounded-lg
        border
        border-white/10
        bg-white/[0.02]
        px-4
        transition-colors
        hover:border-white/20
        hover:bg-white/[0.05]
      "
    >
      <Icon
        size={22}
        className="
          shrink-0
          transition-transform
          duration-300
          group-hover:scale-110
        "
        style={{ color }}
      />

      <span className="truncate text-sm font-medium text-white/70 group-hover:text-white">
        {name}
      </span>
    </motion.div>
  );
}