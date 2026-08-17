"use client";

import { useMemo, useState } from "react";
import { projects, type Project } from "@/data/projects";
import Link from "next/link";
import { ChevronDown, Search  } from "lucide-react";

type SortOption = "newest" | "oldest" | "name";

const categories = [
  "Semua",
  "UI/UX Design",
  "Web App",
  "Photography",
  "Branding",
] as const;

type Category = (typeof categories)[number];




export default function Projects() {
  const [activeCategory, setActiveCategory] =
    useState<Category>("Semua");



  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] =
    useState<SortOption>("newest");




  const [sortOpen, setSortOpen] = useState(false);

  const sortOptions = [
    { value: "newest", label: "Terbaru" },
    { value: "oldest", label: "Terlama" },
    { value: "name", label: "Nama A-Z" },
  ];


  const filteredProjects = useMemo(() => {
    const keyword = search.trim().toLowerCase();


    return projects
      .filter((project) => {
        // ================================
        // CATEGORY
        // ================================

        const matchCategory =
          activeCategory === "Semua" ||
          project.category === activeCategory;

        // ================================
        // SEARCH
        // ================================

        const matchSearch =
          keyword === "" ||
          project.title.toLowerCase().includes(keyword) ||
          project.description.toLowerCase().includes(keyword) ||
          project.category.toLowerCase().includes(keyword) ||
          project.technologies.some((technology) =>
            technology.toLowerCase().includes(keyword),
          );

        return matchCategory && matchSearch;
      })
      .sort((a, b) => {
        // ================================
        // SORT
        // ================================

        if (sortBy === "newest") {
          return Number(b.year) - Number(a.year);
        }

        if (sortBy === "oldest") {
          return Number(a.year) - Number(b.year);
        }

        return a.title.localeCompare(b.title);
      });
  }, [activeCategory, search, sortBy]);

  return (
    <section className="mx-auto  max-w-[1440px] ">
      <div className="space-y-10 mx-4">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Karya & Proyek
          </h1>

          <p className="max-w-2xl text-sm leading-7 text-slate-400">
            Kumpulan proyek nyata yang mencerminkan cara
            berpikir, proses desain, dan kemampuan teknis.
          </p>
        </div>

        {/* =====================================================
            FILTER
        ====================================================== */}

        <div className="sticky top-10 z-[100] flex flex-col gap-2 overflow-visible rounded-lg border border-slate-700/50 bg-slate-950/95 p-4 backdrop-blur-md min-[920px]:flex-row min-[920px]:items-center min-[920px]:justify-between">
          {/* CATEGORY */}

          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            {categories.map((category) => {
              const active =
                activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`flex-1 min-w-max whitespace-nowrap rounded-lg px-3 py-1.5 text-[11px] font-semibold transition ${
                    active
                      ? "bg-sky-500 text-slate-950 hover:bg-sky-400"
                      : "border border-slate-700 text-slate-300 hover:border-sky-500 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* SEARCH + SORT */}
          <div className="flex gap-2 overflow-visible">
            {/* SEARCH */}
            <div className="relative w-full sm:flex-1">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari proyek..."
                className="box-border w-full rounded-lg border border-slate-700 bg-slate-900/80 py-2 pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-500 focus:border-sky-500"
              />
            </div>

          {/* SORT */}
          <div className="relative z-[200] w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                console.log("SORT CLICK");
                setSortOpen((prev) => !prev);
              }}
              className="relative z-[201] flex w-full min-w-[120px] items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium text-white active:bg-slate-800 sm:w-[120px]"
            >
              <span>
                {
                  sortOptions.find(
                    (option) => option.value === sortBy,
                  )?.label
                }
              </span>

              <ChevronDown
                size={14}
                className={`transition-transform ${
                  sortOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {sortOpen && (
              <div className="absolute right-0 top-full z-[9999] mt-2 w-full min-w-[140px] overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-2xl">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSortBy(option.value as SortOption);
                      setSortOpen(false);
                    }}
                    className={`flex w-full px-4 py-3 text-left text-xs ${
                      sortBy === option.value
                        ? "bg-sky-500/10 text-sky-400"
                        : "text-slate-300 active:bg-slate-800"
                    }`}
                  >
                    {sortBy === option.value && (
                      <span className="mr-2">✓</span>
                    )}

                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          </div>
        
        </div>

        {/* =====================================================
            PROJECT HEADER
        ====================================================== */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="h-4 w-1.5 rounded-lg bg-sky-500" />

            <h2 className="text-lg font-semibold text-white">
              Semua Karya
            </h2>
          </div>

          <div className="inline-flex w-fit items-center justify-center rounded-lg border border-slate-700/50 bg-slate-900/80 px-4 py-2 text-xs font-medium text-blue-400">
            {filteredProjects.length} proyek
          </div>
        </div>

        {/* =====================================================
            PROJECT GRID
        ====================================================== */}

        {filteredProjects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
              />
            ))}
          </div>
        ) : (
          <EmptyState search={search} />
        )}
      </div>
    </section>
  );
}

/* =====================================================
   PROJECT CARD
===================================================== */

function ProjectCard({
  project,
}: {
  project: Project;
}) {
  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-slate-700/50 bg-slate-950/80 p-5 shadow-lg shadow-slate-950/20 transition duration-300 hover:-translate-y-1 hover:border-sky-500/40">
      {/* CATEGORY + YEAR */}

      <div className="flex min-w-0 items-start justify-between gap-3">
        <span className="min-w-0 truncate text-xs uppercase tracking-[0.2em] text-sky-300">
          {project.category}
        </span>

        <span className="shrink-0 rounded-lg bg-slate-900/80 px-3 py-1 text-[10px] font-semibold text-slate-400">
          {project.year}
        </span>
      </div>

      {/* TITLE */}

      <h3
        title={project.title}
        className="mt-3 line-clamp-2 text-lg font-semibold leading-snug text-white"
      >
        {project.title}
      </h3>

      {/* DESCRIPTION */}

      <p
        title={project.description}
        className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400"
      >
        {project.description}
      </p>

      {/* TECHNOLOGIES */}

      <div className="mt-auto pt-5">
        <div className="flex flex-wrap gap-2">
          {project.technologies.map(
            (technology) => (
              <span
                key={technology}
                className="max-w-full truncate rounded-lg bg-slate-900/80 px-3 py-1 text-xs text-slate-400"
              >
                {technology}
              </span>
            ),
          )}
        </div>
      </div>

      {/* DETAIL */}

      <Link
        href={`/project/${project.slug}`}
        className="mt-5 inline-flex w-fit items-center gap-2 text-xs font-semibold text-sky-300 transition hover:text-sky-200"
      >
        Lihat project
        <span className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </Link>
    </article>
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
    <div className="rounded-lg border border-dashed border-slate-700 bg-slate-950/50 px-6 py-12 text-center">
      <p className="text-sm font-medium text-slate-300">
        Project tidak ditemukan
      </p>

      {search && (
        <p className="mt-2 text-xs text-slate-500">
          Tidak ada project yang cocok dengan 
          {search}.
        </p>
      )}
    </div>
  );
}