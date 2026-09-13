"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Project } from "@/types/projects";

const truncate = (text: string, maxLength = 92) =>
  text.length <= maxLength ? text : text.slice(0, maxLength).trim() + "...";

// Cycled per card so no single color dominates the row.
// purple -> primary/tech, blue -> accent, emerald -> stable/success
const BANNER_ACCENTS = ["#8B5CF6", "#3B82F6", "#10B981"];

// Treats "", null, undefined, and placeholder "#" links as unusable.
const isUsableUrl = (url?: string | null) =>
  !!url && url.trim() !== "" && url.trim() !== "#";

// Priority: demo -> github -> fallback to the all-projects page.
const getProjectHref = (project: Project) => {
  if (isUsableUrl(project.demo)) {
    return { href: project.demo as string, isExternal: true };
  }
  if (isUsableUrl(project.github)) {
    return { href: project.github as string, isExternal: true };
  }
  return { href: "/projects", isExternal: false };
};

export function ProjectsCarousel({ projects }: { projects: Project[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const isInView = useInView(scrollRef, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [projects.length]);

  const scrollByCard = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 16 : el.clientWidth * 0.85;

    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div
        ref={scrollRef}
        className="
          -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-1
          [-ms-overflow-style:none] [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
          sm:mx-0 sm:px-0
        "
      >
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id ?? project.slug ?? index}
            project={project}
            index={index}
            isInView={isInView}
            prefersReducedMotion={!!prefersReducedMotion}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-2">
        <motion.button
          type="button"
          onClick={() => scrollByCard("left")}
          disabled={!canScrollLeft}
          aria-label="Previous projects"
          whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
          className="
            flex h-9 w-9 items-center justify-center rounded-full
            border border-white/10 bg-white/5 text-white/60
            transition-colors hover:border-white/20 hover:text-white
            disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-white/60
          "
        >
          <ArrowLeft size={15} />
        </motion.button>

        <motion.button
          type="button"
          onClick={() => scrollByCard("right")}
          disabled={!canScrollRight}
          aria-label="Next projects"
          whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
          className="
            flex h-9 w-9 items-center justify-center rounded-full
            border border-white/10 bg-white/5 text-white/60
            transition-colors hover:border-white/20 hover:text-white
            disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-white/60
          "
        >
          <ArrowRight size={15} />
        </motion.button>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Project Card
|--------------------------------------------------------------------------
| The whole card frame tilts toward the cursor position on pointer move
| (subtle 3D distort across the entire card, not just the image), and
| settles back to flat on pointer leave.
*/

function ProjectCard({
  project,
  index,
  isInView,
  prefersReducedMotion,
}: {
  project: Project;
  index: number;
  isInView: boolean;
  prefersReducedMotion: boolean;
}) {
  const accent = BANNER_ACCENTS[index % BANNER_ACCENTS.length];
  const { href, isExternal } = getProjectHref(project);
  const hasImage = isUsableUrl(project.image);
  const tag =
    [project.category, project.year].filter(Boolean).join(" × ") || "Project";

  // Raw pointer position within the card, normalized to -0.5..0.5 (for tilt)
  // and in px relative to the card (for the highlight position).
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);

  const springConfig = { stiffness: 220, damping: 22, mass: 0.5 };
  const rotateX = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [7, -7]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [-7, 7]),
    springConfig
  );

  // Soft purple highlight that follows the cursor, no scale/zoom involved.
  const highlight = useMotionTemplate`radial-gradient(220px circle at ${glowX}px ${glowY}px, rgba(139,92,246,0.16), transparent 75%)`;

  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
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
    <motion.a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      data-card
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="
        group block min-w-0 shrink-0 basis-[82%] snap-start
        sm:basis-[46%] lg:basis-[calc((100%-2rem)/3)]
      "
    >
      {/*
        Clipping (overflow-hidden + rounded corners) lives on this inner
        div, separate from the element carrying the 3D transform above.
        Putting both on the same element makes browsers fail to clip
        correctly once rotateX/rotateY are non-zero, so the banner leaks
        past the card's rounded corners while tilting.
      */}
      <div
        className="
          relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]
          transition-colors group-hover:border-white/20
        "
      >
        {/* Highlight that follows the cursor — no zoom, just a soft glow. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: highlight }}
        />

        <div
          className="relative flex h-40 w-full items-center justify-center overflow-hidden"
          style={{ backgroundColor: hasImage ? undefined : `${accent}1A` }}
        >
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.image as string}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span
              className="px-4 text-center text-lg font-semibold"
              style={{ color: accent }}
            >
              {project.title}
            </span>
          )}
        </div>

        <div className="relative p-5">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/50">
            {tag}
          </span>

          <h3 className="mt-4 text-base font-semibold leading-5 text-white">
            {project.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/60">
            {truncate(project.description || "")}
          </p>
        </div>
      </div>
    </motion.a>
  );
}