"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Edit, X, Image as ImageIcon, Link2 as LinkIcon, Eye, CheckCircle, Loader2, Trash } from "lucide-react";
import type { Project, UpdateProjectInput } from "@/types/projects";
import { FaGithub } from "react-icons/fa";

// Fetch categories dari API
async function fetchCategories(): Promise<string[]> {
  try {
    const res = await fetch("/api/v1/projects/categories", { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// Fetch single project
async function fetchProject(slug: string): Promise<Project | null> {
  try {
    const res = await fetch(`/api/v1/projects/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Generate slug dari title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/--+/g, "-")
    .substring(0, 50);
};

export default function EditProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [slug, setSlug] = useState<string>("");
  
  // State form
  const [formData, setFormData] = useState<Omit<Project, "technologies"> & { technologies: string }>({
    id: "",
    title: "",
    slug: "",
    category: "",
    year: "",
    description: "",
    technologies: "",
    image: "",
    link: "",
    github: "",
    demo: "",
    featured: false,
    created_at: "",
    updated_at: "",
  });

  // State UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const resolvedSlug = (await params).slug;
        setSlug(resolvedSlug);
        
        // Load project
        const project = await fetchProject(resolvedSlug);
        if (!project) {
          setError("Project tidak ditemukan");
          return;
        }
        
        setFormData({
          ...project,
          technologies: project.technologies?.join(", ") || "",
        });
        
        // Load categories
        const cats = await fetchCategories();
        setCategories(cats);
        setIsLoadingCategories(false);
        setIsLoading(false);
      } catch {
        setError("Gagal memuat data");
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Auto-generate slug saat title berubah (jika slug kosong)
  useEffect(() => {
    if (formData.title && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(formData.title),
      }));
    }
  }, [formData.title]);

  // Handle input change
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  // Handle technologies (comma-separated)
  const handleTechChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      technologies: e.target.value,
    }));
  }, []);

  // Handle submit (Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setSuccess(undefined);
    setIsSubmitting(true);

    try {
      if (!formData.title.trim()) {
        setError("Judul tidak boleh kosong");
        return;
      }
      if (!formData.slug.trim()) {
        setError("Slug tidak boleh kosong");
        return;
      }

      // Convert technologies string to array
      const technologies = formData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);

      const payload: UpdateProjectInput = {
        title: formData.title,
        slug: formData.slug,
        category: formData.category || undefined,
        year: formData.year || undefined,
        description: formData.description || undefined,
        technologies,
        image: formData.image || undefined,
        link: formData.link || undefined,
        github: formData.github || undefined,
        demo: formData.demo || undefined,
        featured: formData.featured || false,
      };

      const res = await fetch(`/api/v1/projects/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal memperbarui proyek");
      }

      setSuccess("Project berhasil diperbarui!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!confirm("Apakah kamu yakin ingin menghapus project ini? Tindakan ini tidak bisa dibatalkan.")) {
      return;
    }
    
    setError(undefined);
    setSuccess(undefined);
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/v1/projects/${slug}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menghapus proyek");
      }

      setSuccess("Project berhasil dihapus!");
      setTimeout(() => {
        router.push("/admin/projects");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/admin/projects");
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="mx-auto max-w-[1000px] py-6 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        </div>
      </section>
    );
  }

  // Error state (project not found)
  if (error && !formData.id) {
    return (
      <section className="mx-auto max-w-[1000px] py-6 px-4">
        <div className="rounded-lg border border-dashed border-slate-700 bg-slate-950/50 px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-300">{error}</p>
          <button
            onClick={handleCancel}
            className="mt-4 rounded-lg bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-400 transition hover:bg-cyan-400/20"
          >
            Kembali
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1000px] py-6 px-4">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white">Edit Project</h1>
            <p className="text-sm text-slate-500">Perbarui data proyek</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-xs font-medium text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg hover:bg-red-400/20 disabled:opacity-50 transition flex items-center gap-1"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash size={14} />
                  Hapus
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              form="project-form"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-white bg-cyan-500 rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Edit size={14} />
                  Simpan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success message */}
        {success && (
          <div className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 p-4 flex items-center gap-2 text-cyan-400 text-sm">
            <CheckCircle size={16} />
            {success}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="rounded-lg border border-red-400/30 bg-red-400/10 p-4 flex items-center gap-2 text-red-400 text-sm">
            <X size={16} />
            {error}
          </div>
        )}

        {/* Form */}
        <form id="project-form" onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
                Judul <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Contoh: Portfolio Website"
                className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:bg-slate-900"
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
                Slug <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-2">
                <span className="px-2 py-2.5 bg-slate-800 border border-white/10 rounded-l-lg text-xs text-slate-500">
                  /projects/
                </span>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="portfolio-website"
                  className="flex-1 rounded-r-lg border border-white/10 bg-slate-900/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:bg-slate-900"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">
                Kategori
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="category"
                  value={formData.category || ""}
                  onChange={handleChange}
                  list="edit-categories-list"
                  placeholder={isLoadingCategories ? "Memuat..." : "Pilih atau ketik kategori..."}
                  className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:bg-slate-900"
                />
                {!isLoadingCategories && (
                  <datalist id="edit-categories-list">
                    {categories.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                )}
              </div>
            </div>

            {/* Year */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">
                Tahun
              </label>
              <input
                type="text"
                name="year"
                value={formData.year || ""}
                onChange={handleChange}
                placeholder="2024"
                className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:bg-slate-900"
              />
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-slate-400">
                Deskripsi
              </label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                placeholder="Deskripsi singkat tentang proyek ini..."
                rows={4}
                className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2.5 text-sm text-white outline-none resize-none transition focus:border-cyan-400/50 focus:bg-slate-900"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <ImageIcon size={14} />
                URL Gambar
              </label>
              <input
                type="url"
                name="image"
                value={formData.image || ""}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:bg-slate-900"
              />
            </div>

            {/* Technologies */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
                Teknologi (pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={formData.technologies}
                onChange={handleTechChange}
                placeholder="React, Next.js, Tailwind, Supabase"
                className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:bg-slate-900"
              />
            </div>

            {/* Links */}
            <div className="space-y-4 md:col-span-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
                  <FaGithub size={14} />
                  GitHub Repository <span className="text-slate-600">(Opsional)</span>
                </label>
                <input
                  type="url"
                  name="github"
                  value={formData.github || ""}
                  onChange={handleChange}
                  placeholder="https://github.com/username/repo"
                  className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:bg-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
                  <LinkIcon size={14} />
                  Link Project <span className="text-slate-600">(Opsional)</span>
                </label>
                <input
                  type="url"
                  name="link"
                  value={formData.link || ""}
                  onChange={handleChange}
                  placeholder="https://my-project.com"
                  className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:bg-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
                  <Eye size={14} />
                  Demo URL <span className="text-slate-600">(Opsional)</span>
                </label>
                <input
                  type="url"
                  name="demo"
                  value={formData.demo || ""}
                  onChange={handleChange}
                  placeholder="https://demo.my-project.com"
                  className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:bg-slate-900"
                />
              </div>
            </div>

            {/* Featured Toggle */}
            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured || false}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-white/20 bg-transparent text-cyan-400 focus:ring-cyan-400/50 outline-none"
                />
                <span className="text-xs font-medium text-slate-400">
                  Tampilkan di Featured Projects
                </span>
              </label>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
