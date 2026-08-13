"use client";

import { useMemo, useState } from "react";
import { projects, type Project } from "@/data/projects";
import Link from "next/link";

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

        <div className="sticky top-0 z-50 flex flex-col gap-4 rounded-lg border border-slate-700/50 bg-slate-950/95 p-4 backdrop-blur-md lg:flex-row lg:items-center lg:justify-between">
          {/* CATEGORY */}

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const active =
                activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setActiveCategory(category)
                  }
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition ${
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

          <div className="flex flex-col gap-2 sm:flex-row">
            {/* SEARCH */}

            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Cari proyek..."
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 py-1.5 pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-500 focus:border-sky-500 sm:w-48"
              />

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                />
              </svg>
            </div>

            {/* SORT */}

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as SortOption,
                )
              }
              className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-white outline-none focus:border-sky-500"
            >
              <option value="newest">
                Terbaru
              </option>

              <option value="oldest">
                Terlama
              </option>

              <option value="name">
                Nama A-Z
              </option>
            </select>
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