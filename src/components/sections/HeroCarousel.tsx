"use client";

import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { useRef, useState } from "react";

const slides = [
  {
    id: 1,
    label: "HELLO, I'M",
    title: "Ade Maulana",
    subtitle: "Fullstack Developer",
    description:
      "Saya membangun aplikasi web modern dengan fokus pada performa, pengalaman pengguna, dan solusi yang dapat diandalkan.",
    primary: "View Projects",
    primaryHref: "/projects",
    secondary: "Contact Me",
    secondaryHref: "/contact",
    technologies: ["Laravel", "React", "Next.js", "Node.js"],
  },

  {
    id: 2,
    label: "WHAT I DO",
    title: "Build. Solve. Improve.",
    subtitle: "Web Development",
    description:
      "Mengembangkan aplikasi dari sisi frontend hingga backend, termasuk REST API, database, dan integrasi sistem.",
    primary: "My Projects",
    primaryHref: "/projects",
    secondary: "About Me",
    secondaryHref: "/about",
    technologies: [
      "TypeScript",
      "React",
      "Node.js",
      "MySQL",
    ],
  },

  {
    id: 3,
    label: "LET'S WORK",
    title: "Have a Project?",
    subtitle: "Let's Build Something",
    description:
      "Terbuka untuk peluang kerja, project development, maupun kolaborasi dalam membangun produk digital.",
    primary: "Contact Me",
    primaryHref: "/contact",
    secondary: "View Guide",
    secondaryHref: "/guide",
    technologies: [
      "Frontend",
      "Backend",
      "API",
      "Database",
    ],
  },
];

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0);
    const [dragStart, setDragStart] = useState<number | null>(null);
    const [dragging, setDragging] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    const nextSlide = () => {
        setCurrent((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1,
        );
    };

    const previousSlide = () => {
        setCurrent((prev) =>
        prev === 0 ? slides.length - 1 : prev - 1,
        );
    };

    const handlePointerDown = (
        e: React.PointerEvent<HTMLDivElement>,
    ) => {
        setDragStart(e.clientX);
        setDragging(true);

        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (
        e: React.PointerEvent<HTMLDivElement>,
    ) => {
        if (dragStart === null) return;

        const distance = e.clientX - dragStart;

        if (Math.abs(distance) > 80) {
        if (distance < 0) {
            nextSlide();
        } else {
            previousSlide();
        }

        setDragStart(null);
        }
    };

    const handlePointerUp = () => {
        setDragStart(null);
        setDragging(false);
    };

    const slide = slides[current];
   
  return (
    <section className="relative w-full overflow-hidden">
        <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative min-h-[390px] select-none touch-pan-y overflow-hidden ${
            dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        >
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-24 top-16 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        {/* Content */}
        <div
            key={slide.id}
            className="mx-auto flex min-h-[390px] max-w-[1440px] items-center px-6 py-10 md:px-10 lg:px-14"
        >
            <div className="w-full max-w-3xl animate-[fadeIn_.5s_ease-out]">
            {/* Label */}
            <p className="mb-2 text-[10px] font-medium tracking-[0.3em] text-cyan-400 sm:text-xs">
                {slide.label}
            </p>

            {/* Title */}
            <h1 className="text-4xl font-bold tracking-tight text-slate-100 sm:text-5xl md:text-6xl">
                {slide.title}
            </h1>

            {/* Subtitle */}
            <h2 className="mt-2 text-lg font-semibold text-slate-300 sm:text-xl md:text-2xl">
                {slide.subtitle}
            </h2>

            {/* Description */}
            <p className="mt-3 max-w-2xl text-xs leading-6 text-slate-400 sm:text-sm md:text-base">
                {slide.description}
            </p>

            {/* Buttons */}
            <div className="mt-5 flex flex-wrap gap-2.5">
                <a
                href={slide.primaryHref}
                onPointerDown={(e) => e.stopPropagation()}
                className="
                    flex items-center gap-1.5
                    rounded-lg
                    bg-cyan-400
                    px-4 py-2.5
                    text-xs font-semibold
                    text-slate-950
                    transition-all
                    hover:scale-105
                    hover:bg-cyan-300
                    active:scale-95
                "
                >
                {slide.primary}
                <ArrowUpRight size={14} />
                </a>

                <a
                href={slide.secondaryHref}
                onPointerDown={(e) => e.stopPropagation()}
                className="
                    rounded-lg
                    border border-cyan-400/40
                    px-4 py-2.5
                    text-xs font-semibold
                    text-cyan-400
                    transition-all
                    hover:bg-cyan-400/10
                    active:scale-95
                "
                >
                {slide.secondary}
                </a>
            </div>

            {/* Technologies */}
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[10px] text-slate-500 sm:text-xs">
                {slide.technologies.map((technology) => (
                <span key={technology}>{technology}</span>
                ))}
            </div>
            </div>
        </div>

        {/* Previous */}
        <button
            type="button"
            aria-label="Previous slide"
            onClick={previousSlide}
            onPointerDown={(e) => e.stopPropagation()}
            className="
            absolute left-3 top-1/2 z-10 hidden
            h-8 w-8 -translate-y-1/2
            items-center justify-center
            rounded-full border border-white/10
            bg-slate-900/70
            text-slate-400 backdrop-blur-xl
            transition hover:border-cyan-400/40
            hover:text-cyan-400
            md:flex
            "
        >
            <ChevronLeft size={16} />
        </button>

        {/* Next */}
        <button
            type="button"
            aria-label="Next slide"
            onClick={nextSlide}
            onPointerDown={(e) => e.stopPropagation()}
            className="
            absolute right-3 top-1/2 z-10 hidden
            h-8 w-8 -translate-y-1/2
            items-center justify-center
            rounded-full border border-white/10
            bg-slate-900/70
            text-slate-400 backdrop-blur-xl
            transition hover:border-cyan-400/40
            hover:text-cyan-400
            md:flex
            "
        >
            <ChevronRight size={16} />
        </button>

        {/* Indicator */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
            {slides.map((item, index) => (
            <button
                key={item.id}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => setCurrent(index)}
                onPointerDown={(e) => e.stopPropagation()}
                className={`h-1.5 rounded-full transition-all ${
                current === index
                    ? "w-6 bg-cyan-400"
                    : "w-1.5 bg-slate-600"
                }`}
            />
            ))}
        </div>
        </div>
    </section>
    );
}