"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import ProjectCard from "@/components/admin/projects/ProjectCard";
import ProjectFilters from "@/components/admin/projects/ProjectFilters";
import EmptyState from "@/components/admin/projects/EmptyState";
import { Project, SortOption } from "@/types/projects";

export default function Projects() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/projects/categories", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setCategories(["Semua", ...d]))
      .catch(() => setCategories(["Semua", "Mobile App", "UI/UX Design", "Web App"]))
      .finally(() => setLoadingCategories(false));

    fetch("/api/v1/projects", { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setProjects)
      .catch(() => setError("Gagal memuat proyek. Silakan coba lagi."))
      .finally(() => setLoading(false));
  }, []);

  const resetFilters = () => {
    setSearch("");
    setActiveCategory("Semua");
    setSortBy("newest");
    setShowFilter(false);
  };

  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase();

    return [...projects]
      .filter((p) => {
        const category = activeCategory === "Semua" || p.category === activeCategory;
        const text = [p.title, p.description, p.category, ...(p.technologies || [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return category && (!q || text.includes(q));
      })
      .sort((a, b) => {
        if (sortBy === "name") return (a.title || "").localeCompare(b.title || "");
        const ay = Number(a.year) || 0;
        const by = Number(b.year) || 0;
        return sortBy === "newest" ? by - ay : ay - by;
      });
  }, [projects, search, activeCategory, sortBy]);

  const isFiltered = !!search || activeCategory !== "Semua" || sortBy !== "newest";

  if (loading) return <Loading />;

  if (error) {
    return (
      <section className="mx-auto max-w-[1440px] py-4">
        <div className="mx-4 text-center">
          <h1 className="text-4xl font-bold text-white">Project</h1>
          <p className="mt-3 text-sm text-slate-400">{error}</p>
          <button
            onClick={() => location.reload()}
            className="mt-4 rounded-lg bg-cyan-400/10 px-4 py-2 text-xs text-cyan-400"
          >
            Coba Lagi
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1440px] py-4">
      <div className="mx-4 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">Project</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Kumpulan proyek nyata yang mencerminkan cara berpikir, proses desain, dan kemampuan teknis.
            </p>
          </div>

          <Link
            href="/admin/projects/new"
            className="flex items-center gap-1 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-medium text-white hover:bg-cyan-600"
          >
            <Plus size={14} /> Tambah Project
          </Link>
        </div>

        <ProjectFilters
          search={search}
          setSearch={setSearch}
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          loadingCategories={loadingCategories}
          filteredCount={filteredProjects.length}
          isFiltered={isFiltered}
          resetFilters={resetFilters}
        />

        {filteredProjects.length ? (
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

function Loading() {
  return (
    <section className="mx-auto max-w-[1440px] py-4">
      <div className="mx-4">
        <h1 className="text-4xl font-bold text-white">Project</h1>
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-400" />
        </div>
      </div>
    </section>
  );
}