"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Image as ImageIcon, Link as LinkIcon, Eye, Check, Loader2 } from "lucide-react";
import type { Project, CreateProjectInput } from "@/types/projects";

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

export default function NewProjectPage() {
  const router = useRouter();
  
  // State form
  const [formData, setFormData] = useState<Omit<CreateProjectInput, "technologies"> & { technologies: string }>({
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
  });

  // State UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Fetch categories saat mount
  useEffect(() => {
    const loadCategories = async () => {
      const cats = await fetchCategories();
      setCategories(cats);
      setIsLoadingCategories(false);
    };
    loadCategories();
  }, []);

  // Auto-generate slug saat title berubah
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

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validasi
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

      const payload: CreateProjectInput = {
        ...formData,
        technologies,
      };

      const res = await fetch("/api/v1/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menyimpan proyek");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/projects");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/admin/projects");
  };

  return (
    <section className="mx-auto max-w-[1000px] py-6 px-4">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white">Tambah Project Baru</h1>
            <p className="text-sm text-slate-500">Isi form untuk menambahkan proyek baru</p>
          </div>
          <div className="flex gap-2">
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
                  <Plus size={14} />
                  Simpan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success message */}
        {success && (
          <div className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 p-4 flex items-center gap-2 text-cyan-400 text-sm">
            <Check size={16} />
            Project berhasil disimpan!
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
                  value={formData.category}
                  onChange={handleChange}
                  list="categories-list"
                  placeholder={isLoadingCategories ? "Memuat..." : "Pilih atau ketik kategori..."}
                  className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:bg-slate-900"
                />
                {!isLoadingCategories && (
                  <datalist id="categories-list">
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
                value={formData.year}
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
                value={formData.description}
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
                value={formData.image}
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
                  value={formData.github}
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
                  value={formData.link}
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
                  value={formData.demo}
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
