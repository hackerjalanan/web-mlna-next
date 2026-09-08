"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, SlidersHorizontal, CalendarDays, Code2, ExternalLink } from "lucide-react";

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
  category: string | null;
  year: string | null;
  description: string | null;
  technologies: string[];
  image: string | null;
  link: string | null;
  github: string | null;
  demo: string | null;
  featured: boolean | null;
  created_at: string | null;
}

export default function Projects() {
  // Fetch categories from database
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilter, setShowFilter] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isFiltered = search !== "" || activeCategory !== "" || sortBy !== "newest";

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await fetch("/api/v1/projects/categories", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setCategories(["Semua", ...data]);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories(["Semua", "Mobile App", "UI/UX Design", "Web App"]);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/v1/projects", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Gagal memuat proyek. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const resetFilters = () => {
    setSearch("");
    setActiveCategory("");
    setSortBy("newest");
    setShowFilter(false);
  };

  const filteredProjects = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return projects
      .filter((project) => {
        const matchCategory = !activeCategory || activeCategory === "Semua" || project.category === activeCategory;
        const matchSearch =
          keyword === "" ||
          project.title?.toLowerCase().includes(keyword) ||
          project.description?.toLowerCase().includes(keyword) ||
          project.category?.toLowerCase().includes(keyword) ||
          project.technologies?.some((t) => t.toLowerCase().includes(keyword));
        return matchCategory && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          const aYear = Number(a.year) || 0;
          const bYear = Number(b.year) || 0;
          return bYear - aYear;
        }
        if (sortBy === "oldest") {
          const aYear = Number(a.year) || 0;
          const bYear = Number(b.year) || 0;
          return aYear - bYear;
        }
        return (a.title || "").localeCompare(b.title || "");
      });
  }, [activeCategory, search, sortBy, projects]);

  if (loading) {
    return (
      <section className="mx-auto max-w-[1440px] py-4">
        <div className="mx-4 space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Project
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-400">
              Kumpulan proyek nyata yang mencerminkan cara berpikir, proses desain, dan kemampuan teknis.
            </p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-[1440px] py-4">
        <div className="mx-4 space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Project
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-400">
              Kumpulan proyek nyata yang mencerminkan cara berpikir, proses desain, dan kemampuan teknis.
            </p>
          </div>
          <div className="rounded-lg border border-dashed border-slate-700 bg-slate-950/50 px-6 py-12 text-center">
            <p className="text-sm font-medium text-slate-300">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-400 transition hover:bg-cyan-400/20"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1440px] py-4">
      <div className="mx-4 space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Project
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-400">
            Kumpulan proyek nyata yang mencerminkan cara berpikir, proses desain, dan kemampuan teknis.
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari proyek..."
                className="h-9 w-full rounded-md border border-white/10 bg-slate-900/70 pl-9 pr-8 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400/50 focus:bg-slate-900"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded text-slate-500 transition hover:bg-white/10 hover:text-white"
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowFilter((prev) => !prev)}
              className={`relative flex h-9 shrink-0 items-center gap-2 rounded-md border px-3 text-xs font-medium transition-all ${
                showFilter || isFiltered
                  ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-400"
                  : "border-white/10 bg-slate-900/70 text-slate-400 hover:border-white/20 hover:bg-white/5 hover:text-white"
              }`}
            >
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">Filter</span>
              {isFiltered && (
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-cyan-400 ring-2 ring-slate-950" />
              )}
            </button>

            <span className="hidden shrink-0 text-xs text-slate-500 sm:block">
              {filteredProjects.length} proyek
            </span>
          </div>

          {showFilter && (
            <div className="mt-2 rounded-xl border border-white/10 bg-slate-900/80 p-3 shadow-xl shadow-black/10 backdrop-blur-xl">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                    Kategori
                  </span>
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {isLoadingCategories ? (
                    <button
                      type="button"
                      className="whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium text-slate-500 cursor-not-allowed"
                    >
                      Memuat kategori...
                    </button>
                  ) : (
                    categories.map((item) => {
                      const active = activeCategory === item;
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setActiveCategory(item)}
                          className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                            active
                              ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/10"
                              : "border border-white/10 bg-white/[0.03] text-slate-500 hover:border-white/20 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {item}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="my-3 h-px bg-white/5" />

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <CalendarDays size={13} className="text-slate-600" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                    Urutkan
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSortBy(option.value as SortOption)}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                        sortBy === option.value
                          ? "bg-white/10 text-white"
                          : "text-slate-500 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {isFiltered && (
                <>
                  <div className="my-3 h-px bg-white/5" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">
                      {filteredProjects.length} proyek ditemukan
                    </span>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-slate-500 transition hover:bg-white/5 hover:text-white"
                    >
                      <X size={12} />
                      Reset
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState search={search} />
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const hasGithub = project.github && project.github !== "#" && project.github.trim() !== "";
  const hasDemo = project.demo && project.demo !== "#" && project.demo.trim() !== "";
  const hasLink = project.link && project.link !== "#" && project.link.trim() !== "";

  return (
    <article className="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/30 hover:shadow-xl hover:shadow-cyan-400/5">
      <div className="absolute top-3 left-3 z-10">
        <span className="rounded-lg bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-400">
          {project.category}
        </span>
      </div>

      <div className="absolute top-3 right-3 z-10">
        <span className="rounded-lg bg-slate-900/80 px-3 py-1 text-xs font-semibold text-slate-400">
          {project.year}
        </span>
      </div>

      <div className="p-5 pt-12">
        <h3 title={project.title} className="line-clamp-2 text-lg font-semibold leading-snug text-white">
          {project.title}
        </h3>
        <p title={project.description} className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies?.map((tech) => (
            <span key={tech} className="truncate rounded-lg bg-slate-900/80 px-2 py-1 text-[10px] text-slate-400">
              {tech}
            </span>
          ))}
        </div>

        {/* Link Buttons */}
        <div className="mt-4 flex gap-2">
          {hasGithub && (
            <Link
              href={project.github!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-cyan-400/10 hover:text-cyan-400"
            >
              <Code2 size={14} />
              GitHub
            </Link>
          )}
          
          {(hasDemo || hasLink) && (
            <Link
              href={project.demo || project.link!}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                hasDemo
                  ? "bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20"
                  : "bg-slate-900/80 text-slate-400 hover:bg-slate-800"
              }`}
            >
              <ExternalLink size={14} />
              {hasDemo ? "Demo" : "Lihat"}
            </Link>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
    </article>
  );
}

function EmptyState({ search }: { search: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-700 bg-slate-950/50 px-6 py-12 text-center">
      <p className="text-sm font-medium text-slate-300">Proyek tidak ditemukan</p>
      {search && (
        <p className="mt-2 text-xs text-slate-500">
          Tidak ada proyek yang cocok dengan <span className="text-cyan-400">{search}</span>
        </p>
      )}
    </div>
  );
}
