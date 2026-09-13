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
import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";

// =====================================================
// DATA (tidak diubah, hanya struktur tampilan)
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
// SHARED: scroll-reveal wrapper (fade + slide up)
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
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// =====================================================
// SHARED: tilt card — distorsi 3D halus saat hover
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

  const springConfig = { stiffness: 220, damping: 22, mass: 0.5 };
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-6, 6]), springConfig);

  const highlight = useMotionTemplate`radial-gradient(200px circle at ${glowX}px ${glowY}px, ${accent}1F, transparent 75%)`;

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    pointerX.set(x / rect.width - 0.5);
    pointerY.set(y / rect.height - 0.5);
    glowX.set(x);
    glowY.set(y);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={className}
    >
      <div className="relative h-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/20">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{ background: highlight }}
        />
        <div className="relative z-10 h-full">{children}</div>
      </div>
    </motion.div>
  );
}

// =====================================================
// DOTTED BRAND MARK — "AD.EM" tersusun dari titik-titik,
// diambil dari alpha channel teks yang digambar di canvas
// offscreen. Highlight lembut mengikuti kursor (blend
// overlay) untuk efek terang-gelap seperti referensi.
// =====================================================

function DottedBrandMark() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const glow = useMotionTemplate`radial-gradient(320px circle at ${glowX}px ${glowY}px, rgba(255,255,255,0.35), transparent 70%)`;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Canvas offscreen — dipakai hanya untuk membaca area huruf "AD.EM"
      const off = document.createElement("canvas");
      off.width = rect.width;
      off.height = rect.height;
      const offCtx = off.getContext("2d");
      if (!offCtx) return;

      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillStyle = "#fff";

      let fontSize = rect.height * 0.5;
      const setFont = (size: number) => {
        offCtx.font = `600 ${size}px "Cinzel", serif`;
      };

      setFont(fontSize);
      const maxWidth = rect.width * 0.8;
      let textWidth = offCtx.measureText("AD.EM").width;
      if (textWidth > maxWidth) {
        fontSize *= maxWidth / textWidth;
        setFont(fontSize);
      }

      offCtx.fillText("AD.EM", rect.width / 2, rect.height / 2);
      const { data } = offCtx.getImageData(0, 0, rect.width, rect.height);

      const spacing = 5;
      const dotRadius = 0.9;
      ctx.fillStyle = "rgba(255,255,255,0.18)";

      for (let y = 0; y < rect.height; y += spacing) {
        for (let x = 0; x < rect.width; x += spacing) {
          const idx = (Math.floor(y) * rect.width + Math.floor(x)) * 4;
          if (data[idx + 3] > 128) {
            ctx.beginPath();
            ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    glowX.set(e.clientX - rect.left);
    glowY.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="relative h-[220px] w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] sm:h-[280px] lg:h-[340px]"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden
          style={{ background: glow, mixBlendMode: "overlay" }}
          className="pointer-events-none absolute inset-0"
        />
      )}
      <span className="absolute left-5 top-5 text-xs font-medium tracking-wide text-white/50">
      </span>
    </div>
  );
}

// =====================================================
// PAGE
// =====================================================

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050505]">
      <div className="mx-auto max-w-[1440px] px-16 py-10 sm:px-6 lg:px-10">
        {/* Dotted brand mark + Header */}
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

            <Reveal delay={0.1} className="max-w-2xl">
              <p className="mb-3 text-sm font-medium text-[#8B5CF6]">ABOUT ME</p>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Ade Maulana Hidayah
              </h1>
              <p className="mt-4 text-base leading-7 text-white/50 sm:text-lg">
                Saya Ade Maulana Hidayah, seorang programmer dengan fokus pada
                pengembangan aplikasi web dan pengalaman di sisi frontend
                maupun backend.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Profile */}
        <section className="mb-24 grid gap-12 md:grid-cols-[1.15fr_0.85fr] md:items-center">
          {/* Profile */}
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
                  I have a background in Information Systems with a strong
                  interest in software development, especially modern web
                  applications.
                </p>

                <p>
                  I work across the frontend and backend, building REST APIs,
                  managing databases, implementing authentication, and
                  maintaining reliable web applications.
                </p>

                <p>
                  I enjoy turning ideas and business requirements into
                  structured, practical, and maintainable digital solutions.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Decorative visual */}
          <Reveal delay={0.1}>
            <TechBlocks />
          </Reveal>
        </section>


        {/* =====================================================
            QUICK INFORMATION
        ===================================================== */}
        <section className="mb-24 grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-center">
          {/* Decorative side */}
          <Reveal>
            <div className="hidden md:block">
              <div className="relative h-[260px] overflow-hidden border border-white/[0.06]">
                {/* Grid */}
                <div
                  className="
                    absolute inset-0
                    opacity-30
                    [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]
                    [background-size:32px_32px]
                  "
                />

                {/* Purple blocks */}
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

                {/* Label */}
                <div className="absolute bottom-4 left-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/20">
                    Developer / 02
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Quick Info */}
          <Reveal delay={0.1}>
            <div className="w-full max-w-md md:ml-auto md:pr-6 lg:pr-10">
              {/* Heading */}
              <div className="mb-7">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8B5CF6]">
                  02 / Information
                </p>

                <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Quick Information
                </h2>
              </div>

              {/* Information */}
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

                {/* Availability */}
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

        {/* What I Do */}
        <section className="mb-20">
          <Reveal className="mb-8">
            <p className="text-xs text-[#8B5CF6]">EXPERTISE</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              What I Do
            </h2>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Reveal key={service.title} delay={index * 0.06}>
                  <TiltCard accent={service.color} className="h-full">
                    <div className="p-5">
                      <div
                        className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${service.color}1A`, color: service.color }}
                      >
                        <Icon size={20} />
                      </div>
                      <h3 className="text-base font-semibold text-white">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-white/50">
                        {service.description}
                      </p>
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Skills */}
        <section className="mb-20">
          <Reveal className="mb-8">
            <p className="text-xs text-[#8B5CF6]">TECHNOLOGIES</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Technical Skills
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <Reveal key={skill.name} delay={Math.min(index * 0.03, 0.4)}>
                  <SkillTile name={skill.name} icon={Icon} color={skill.color} />
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Experience */}
        <section className="mb-20">
          <Reveal className="mb-8">
            <p className="text-xs text-[#8B5CF6]">EXPERIENCE</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Work Experience
            </h2>
          </Reveal>

          <div className="space-y-4">
            {experiences.map((experience, index) => (
              <Reveal key={`${experience.role}-${experience.company}`} delay={index * 0.08}>
                <TiltCard accent="#8B5CF6">
                  <div className="flex gap-4 p-5">
                    <div className="hidden h-10 w-10 shrink-0 items-center justify-center bg-white/5 text-[#8B5CF6] sm:flex">
                      <BriefcaseBusiness size={19} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-white">
                          {experience.role}
                        </h3>
                        <span className="text-xs text-white/30">•</span>
                        <span className="text-sm text-[#8B5CF6]">
                          {experience.period}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-white/40">
                        {experience.company}
                      </p>
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

        {/* Values */}
        <Reveal className="border-t border-white/10 pt-12">
          <div className="max-w-3xl">
            <p className="text-xs text-[#8B5CF6]">WORKING PRINCIPLES</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              How I Work
            </h2>
            <div className="mt-5 space-y-3 text-base leading-7 text-white/50">
              <p>
                Saya berfokus membangun aplikasi dengan struktur kode yang
                rapi, efisien, dan mudah dikembangkan untuk kebutuhan jangka
                panjang.
              </p>
              <p>
                Terbiasa melakukan analisis masalah, debugging, membaca
                dokumentasi, menggunakan Git dalam workflow pengembangan,
                senang mengeksplorasi teknologi baru untuk meningkatkan
                kualitas setiap project yang dikerjakan.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}

// =====================================================
// Skill tile — hover distortion ringan (tilt + scale icon)
// =====================================================

function SkillTile({
  name,
  icon: Icon,
  color,
}: {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  color: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springConfig = { stiffness: 250, damping: 20 };
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-8, 8]), springConfig);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 500 }}
      className="group flex h-16 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
    >
      <Icon
        size={22}
        className="shrink-0 transition-transform duration-300 group-hover:scale-110"
        style={{ color }}
      />
      <span className="truncate text-sm font-medium text-white/70 group-hover:text-white">
        {name}
      </span>
    </motion.div>
  );
}