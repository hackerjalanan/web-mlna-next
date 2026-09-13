"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import {
  Search,
  X,
  SlidersHorizontal,
  CalendarDays,
  Code2,
  ExternalLink,
} from "lucide-react";

import Loading from "@/context/Loading";

type Category = string;
type SortOption = "newest" | "oldest" | "name";

const sortOptions = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "name", label: "Nama A-Z" },
] as const;

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string | undefined;
  year: string | undefined;
  description: string | undefined;
  technologies: string[];
  image: string | undefined;
  link: string | undefined;
  github: string | undefined;
  demo: string | undefined;
  featured: boolean | null;
  created_at: string | undefined;
}

/* =====================================================
   CATEGORY COLORS
===================================================== */

const CATEGORY_COLORS: Record<string, string> = {
  "Web App": "#8B5CF6",
  "Landing Page": "#3B82F6",
  "Mobile App": "#10B981",
  "E-commerce": "#EF4444",
  "UI/UX Design": "#F59E0B",
};

const DEFAULT_CATEGORY_COLOR = "#8B5CF6";

function getCategoryColor(category?: string) {
  if (!category) return DEFAULT_CATEGORY_COLOR;

  return (
    CATEGORY_COLORS[category] ??
    DEFAULT_CATEGORY_COLOR
  );
}

/* =====================================================
   MAIN
===================================================== */

export default function Projects() {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] =
    useState(true);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<Category>("");
  const [sortBy, setSortBy] =
    useState<SortOption>("newest");

  const [showFilter, setShowFilter] =
    useState(false);

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | undefined>(undefined);

  const isFiltered =
    search !== "" ||
    activeCategory !== "" ||
    sortBy !== "newest";

  /* =====================================================
     FETCH CATEGORIES
  ===================================================== */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);

        const response = await fetch(
          "/api/v1/projects/categories",
          {
            cache: "no-store",
          }
        );

        if (response.ok) {
          const data = await response.json();

          setCategories([
            "Semua",
            ...data,
          ]);
        }
      } catch (err) {
        console.error(
          "Error fetching categories:",
          err
        );

        setCategories([
          "Semua",
          "Mobile App",
          "UI/UX Design",
          "Web App",
        ]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  /* =====================================================
     FETCH PROJECTS
  ===================================================== */

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "/api/v1/projects",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch projects"
          );
        }

        const data = await response.json();

        setProjects(data);
        setError(undefined);
      } catch (err) {
        console.error(
          "Error fetching projects:",
          err
        );

        setError(
          "Gagal memuat proyek. Silakan coba lagi."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  /* =====================================================
     RESET FILTER
  ===================================================== */

  const resetFilters = () => {
    setSearch("");
    setActiveCategory("");
    setSortBy("newest");
    setShowFilter(false);
  };

  /* =====================================================
     FILTER + SORT
  ===================================================== */

  const filteredProjects = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    return projects
      .filter((project) => {
        const matchCategory =
          !activeCategory ||
          activeCategory === "Semua" ||
          project.category === activeCategory;

        const matchSearch =
          keyword === "" ||
          project.title
            ?.toLowerCase()
            .includes(keyword) ||
          project.description
            ?.toLowerCase()
            .includes(keyword) ||
          project.category
            ?.toLowerCase()
            .includes(keyword) ||
          project.technologies?.some((tech) =>
            tech
              .toLowerCase()
              .includes(keyword)
          );

        return (
          matchCategory &&
          matchSearch
        );
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return (
            (Number(b.year) || 0) -
            (Number(a.year) || 0)
          );
        }

        if (sortBy === "oldest") {
          return (
            (Number(a.year) || 0) -
            (Number(b.year) || 0)
          );
        }

        return (a.title || "").localeCompare(
          b.title || ""
        );
      });
  }, [
    activeCategory,
    search,
    sortBy,
    projects,
  ]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <section className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-10">
        <Header />

        <div className="flex h-64 items-center justify-center">
          <Loading label="Memuat proyek..." size={32} />
        </div>
      </section>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <section className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-10">
        <Header />

        <div
          className="
            mt-8
            rounded-xl
            border
            border-dashed
            border-white/10
            px-6
            py-12
            text-center
          "
        >
          <p className="text-sm font-medium text-white/70">
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="
              mt-4
              rounded-lg
              border
              border-[#8B5CF6]/20
              bg-[#8B5CF6]/10
              px-4
              py-2
              text-xs
              font-medium
              text-[#A78BFA]
              transition
              hover:bg-[#8B5CF6]/20
            "
          >
            Coba Lagi
          </button>
        </div>
      </section>
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <section
      className="
        mx-auto
        max-w-[1280px]
        px-4
        py-6
        sm:px-6
        lg:px-10
      "
    >
      <Header />

      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <div className="mt-8">
        <div className="flex items-center gap-2">
          {/* Search */}

          <div className="relative flex-1">
            <Search
              size={15}
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-white/30
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Cari proyek..."
              className="
                h-10
                w-full
                rounded-lg
                border
                border-white/10
                bg-white/[0.025]
                pl-9
                pr-8
                text-sm
                text-white
                outline-none
                transition
                placeholder:text-white/25
                focus:border-[#8B5CF6]/40
                focus:bg-white/[0.04]
              "
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="
                  absolute
                  right-2
                  top-1/2
                  flex
                  h-6
                  w-6
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded
                  text-white/40
                  transition
                  hover:bg-white/10
                  hover:text-white
                "
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter */}

          <button
            type="button"
            onClick={() =>
              setShowFilter((prev) => !prev)
            }
            className={`
              relative
              flex
              h-10
              shrink-0
              items-center
              gap-2
              rounded-lg
              border
              px-3
              text-xs
              font-medium
              transition
              ${showFilter || isFiltered
                ? `
                    border-[#8B5CF6]/30
                    bg-[#8B5CF6]/10
                    text-[#A78BFA]
                  `
                : `
                    border-white/10
                    bg-white/[0.025]
                    text-white/50
                    hover:border-white/20
                    hover:text-white
                  `
              }
            `}
          >
            <SlidersHorizontal size={14} />

            <span className="hidden sm:inline">
              Filter
            </span>

            {isFiltered && (
              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  h-2
                  w-2
                  rounded-full
                  bg-[#8B5CF6]
                  ring-2
                  ring-[#050505]
                "
              />
            )}
          </button>

          <span className="hidden shrink-0 text-xs text-white/30 sm:block">
            {filteredProjects.length} proyek
          </span>
        </div>

        {/* =================================================
            FILTER PANEL
        ================================================= */}

        <AnimatePresence>
          {showFilter && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              transition={{
                duration: 0.25,
              }}
              className="
                mt-2
                overflow-hidden
                rounded-xl
                border
                border-white/10
                bg-white/[0.025]
              "
            >
              <div className="p-4">
                <span
                  className="
                    mb-2
                    block
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-white/30
                  "
                >
                  Kategori
                </span>

                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {isLoadingCategories ? (
                    <div className="flex items-center px-2 py-1">
                      <Loading label="Memuat kategori..." size={16} />
                    </div>
                  ) : (
                    categories.map((item) => {
                      const active =
                        activeCategory ===
                        item;

                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            setActiveCategory(
                              item
                            )
                          }
                          className={`
                            whitespace-nowrap
                            rounded-md
                            px-3
                            py-1.5
                            text-xs
                            font-medium
                            transition
                            ${active
                              ? `
                                  bg-[#8B5CF6]
                                  text-white
                                `
                              : `
                                  border
                                  border-white/10
                                  text-white/50
                                  hover:border-white/20
                                  hover:text-white
                                `
                            }
                          `}
                        >
                          {item}
                        </button>
                      );
                    })
                  )}
                </div>

                <div className="my-4 h-px bg-white/[0.07]" />

                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <CalendarDays
                      size={13}
                      className="text-white/30"
                    />

                    <span
                      className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wider
                        text-white/30
                      "
                    >
                      Urutkan
                    </span>
                  </div>

                  <div className="flex gap-1.5">
                    {sortOptions.map(
                      (option) => (
                        <button
                          key={
                            option.value
                          }
                          type="button"
                          onClick={() =>
                            setSortBy(
                              option.value
                            )
                          }
                          className={`
                            rounded-md
                            px-3
                            py-1.5
                            text-xs
                            font-medium
                            transition
                            ${sortBy ===
                              option.value
                              ? `
                                  bg-white/10
                                  text-white
                                `
                              : `
                                  text-white/40
                                  hover:text-white
                                `
                            }
                          `}
                        >
                          {option.label}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {isFiltered && (
                  <>
                    <div className="my-4 h-px bg-white/[0.07]" />

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/30">
                        {
                          filteredProjects.length
                        }{" "}
                        proyek ditemukan
                      </span>

                      <button
                        type="button"
                        onClick={
                          resetFilters
                        }
                        className="
                          flex
                          items-center
                          gap-1
                          rounded-md
                          px-2
                          py-1.5
                          text-xs
                          text-white/40
                          transition
                          hover:text-white
                        "
                      >
                        <X size={12} />
                        Reset
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =================================================
          PROJECT GRID
      ================================================= */}

      {filteredProjects.length > 0 ? (
        <div
          className="
            mt-8
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            xl:grid-cols-3
          "
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map(
              (project, index) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  index={index}
                />
              )
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState search={search} />
        </div>
      )}
    </section>
  );
}

/* =====================================================
   HEADER
===================================================== */

function Header() {
  return (
    <div className="space-y-3">
      <h1
        className="
          text-3xl
          font-semibold
          tracking-tight
          text-white
          sm:text-4xl
          lg:text-5xl
        "
      >
        Projects
      </h1>

      <p
        className="
          max-w-2xl
          text-sm
          leading-7
          text-white/45
          sm:text-base
        "
      >
        A collection of real-world projects that reflect the mindset, design process, and technical capabilities.
      </p>
    </div>
  );
}

/* =====================================================
   PROJECT CARD
===================================================== */

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const prefersReducedMotion =
    useReducedMotion();

  const accent = getCategoryColor(
    project.category
  );

  const hasGithub =
    project.github &&
    project.github !== "#" &&
    project.github.trim() !== "";

  const hasDemo =
    project.demo &&
    project.demo !== "#" &&
    project.demo.trim() !== "";

  const hasLink =
    project.link &&
    project.link !== "#" &&
    project.link.trim() !== "";

  const hasImage =
    project.image &&
    project.image.trim() !== "";

  return (
    <motion.article
      layout
      initial={
        prefersReducedMotion
          ? undefined
          : {
            opacity: 0,
            y: 16,
          }
      }
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -8,
      }}
      transition={{
        duration: 0.4,
        delay: Math.min(
          index * 0.05,
          0.3
        ),
        ease: "easeOut",
      }}
      className="
        group
        flex
        min-h-0
        flex-col
        overflow-hidden
        rounded-xl
        border
        border-white/10
        bg-white/[0.025]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-white/20
        hover:bg-white/[0.035]
      "
    >
      {/* =================================================
          THUMBNAIL
      ================================================= */}

      <div
        className="
          relative
          aspect-[16/9]
          w-full
          overflow-hidden
          border-b
          border-white/[0.08]
          bg-white/[0.02]
        "
      >
        {hasImage ? (
          <Image
            src={project.image as string}
            alt={project.title}
            fill
            sizes="
              (max-width: 640px) 100vw,
              (max-width: 1280px) 50vw,
              33vw
            "
            className="
              object-cover
              transition-transform
              duration-500
              group-hover:scale-[1.03]
            "
          />
        ) : (
          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
            "
            style={{
              backgroundColor: `${accent}08`,
            }}
          >
            <Code2
              size={34}
              strokeWidth={1.2}
              style={{
                color: `${accent}80`,
              }}
            />
          </div>
        )}

        {/* subtle overlay */}

        <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-transparent" />

        {/* Category */}

        <div className="absolute left-3 top-3">
          <span
            className="
              rounded-md
              border
              px-2.5
              py-1
              text-[10px]
              font-medium
              backdrop-blur-md
            "
            style={{
              borderColor: `${accent}40`,
              backgroundColor: "#050505cc",
              color: accent,
            }}
          >
            {project.category ||
              "Project"}
          </span>
        </div>

        {/* Year */}

        {project.year && (
          <div className="absolute right-3 top-3">
            <span
              className="
                rounded-md
                border
                border-white/10
                bg-[#050505cc]
                px-2
                py-1
                text-[10px]
                font-medium
                text-white/50
                backdrop-blur-md
              "
            >
              {project.year}
            </span>
          </div>
        )}
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="flex flex-1 flex-col p-5">
        {/* Title */}

        <h3
          title={project.title}
          className="
            line-clamp-2
            text-lg
            font-semibold
            leading-snug
            tracking-tight
            text-white
          "
        >
          {project.title}
        </h3>

        {/* Description */}

        <p
          title={project.description}
          className="
            mt-2
            line-clamp-3
            text-sm
            leading-6
            text-white/45
          "
        >
          {project.description ||
            "Tidak ada deskripsi proyek."}
        </p>

        {/* Technologies */}

        {project.technologies?.length >
          0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.technologies
                .slice(0, 4)
                .map((tech) => (
                  <span
                    key={tech}
                    className="
                    rounded-md
                    border
                    border-white/10
                    bg-white/[0.02]
                    px-2
                    py-1
                    text-[10px]
                    font-medium
                    text-white/45
                  "
                  >
                    {tech}
                  </span>
                ))}

              {project.technologies.length >
                4 && (
                  <span
                    className="
                  rounded-md
                  border
                  border-white/10
                  px-2
                  py-1
                  text-[10px]
                  text-white/25
                "
                  >
                    +
                    {project.technologies
                      .length - 4}
                  </span>
                )}
            </div>
          )}

        {/* Actions */}

        {(hasGithub ||
          hasDemo ||
          hasLink) && (
            <div className="mt-5 flex gap-2 border-t border-white/[0.07] pt-4">
              {hasGithub && (
                <Link
                  href={project.github!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                  flex
                  items-center
                  gap-1.5
                  rounded-lg
                  border
                  border-white/10
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-white/55
                  transition
                  hover:border-white/20
                  hover:bg-white/5
                  hover:text-white
                "
                >
                  <Code2 size={14} />

                  GitHub
                </Link>
              )}

              {(hasDemo || hasLink) && (
                <Link
                  href={
                    project.demo ||
                    project.link!
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                  flex
                  items-center
                  gap-1.5
                  rounded-lg
                  border
                  px-3
                  py-2
                  text-xs
                  font-medium
                  transition
                "
                  style={{
                    borderColor: `${accent}35`,
                    backgroundColor: `${accent}10`,
                    color: accent,
                  }}
                >
                  <ExternalLink size={14} />

                  {hasDemo
                    ? "Demo"
                    : "Lihat"}
                </Link>
              )}
            </div>
          )}
      </div>
    </motion.article>
  );
}

/* =====================================================
   EMPTY STATE
===================================================== */

function EmptyState({
  search,
}: {
  search: string;
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-dashed
        border-white/10
        px-6
        py-16
        text-center
      "
    >
      <div
        className="
          mx-auto
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-lg
          border
          border-white/10
          bg-white/[0.03]
        "
      >
        <Search
          size={17}
          className="text-white/30"
        />
      </div>

      <p className="mt-4 text-sm font-medium text-white/70">
        Proyek tidak ditemukan
      </p>

      {search && (
        <p className="mt-2 text-xs text-white/35">
          Tidak ada proyek yang cocok dengan{" "}
          <span className="text-[#A78BFA]">
            {search}
          </span>
        </p>
      )}
    </div>
  );
}