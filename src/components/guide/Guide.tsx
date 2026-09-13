"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Search,
  Terminal,
  ChevronRight,
  Clock,
  X,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";

import { guides, type GuideCategory } from "@/data/guides";

const categories: GuideCategory[] = [
  "All",
  "Terminal",
  "Next.js",
  "React",
  "Laravel",
  "Database",
  "Git",
  "Troubleshooting",
];

const CATEGORY_COLORS: Record<string, string> = {
  Terminal: "#EF4444",
  "Next.js": "#FFFFFF",
  React: "#3B82F6",
  Laravel: "#EF4444",
  Database: "#10B981",
  Git: "#F05032",
  Troubleshooting: "#8B5CF6",
};
const DEFAULT_COLOR = "#8B5CF6";
const getCategoryColor = (category: string) => CATEGORY_COLORS[category] ?? DEFAULT_COLOR;

export default function Guide() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<GuideCategory>("All");
  const [openGuide, setOpenGuide] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const isFiltered = search !== "" || category !== "All";

  const sortedGuides = useMemo(
    () => [...guides].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    []
  );

  const filteredGuides = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    return sortedGuides.filter((guide) => {
      const matchSearch =
        guide.title.toLowerCase().includes(keyword) ||
        guide.description.toLowerCase().includes(keyword) ||
        guide.category.toLowerCase().includes(keyword);
      const matchCategory = category === "All" || guide.category === category;
      return matchSearch && matchCategory;
    });
  }, [search, category, sortedGuides]);

  // Guide terbaru ditonjolkan sebagai featured — hanya saat tidak sedang difilter,
  // supaya list hasil pencarian tetap rapi tanpa duplikasi featured di atasnya.
  const featured = !isFiltered ? sortedGuides[0] : null;
  const restGuides = featured
    ? filteredGuides.filter((g) => g.id !== featured.id)
    : filteredGuides;

  // Ringkasan jumlah guide per kategori — mengisi ruang atas dengan info berguna
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    guides.forEach((g) => {
      counts[g.category] = (counts[g.category] ?? 0) + 1;
    });
    return counts;
  }, []);

  return (
    <section className="min-h-screen py-2">
      <div className="mx-auto max-w-[1440px] px-4 md:px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="mb-2 text-sm font-medium text-[#8B5CF6]">DEVELOPER GUIDE</p>
            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Guide
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
              Catatan, dokumentasi, tutorial, command terminal, dan berbagai panduan development.
            </p>
          </div>

          {/* Mini stats — mengisi ruang kosong di header dengan info berguna */}
          <div className="flex shrink-0 gap-5 border-t border-white/10 pt-4 md:border-t-0 md:pt-0">
            <div>
              <p className="text-2xl font-semibold text-white">{guides.length}</p>
              <p className="text-xs text-white/40">Total Guide</p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-2xl font-semibold text-white">{categories.length - 1}</p>
              <p className="text-xs text-white/40">Kategori</p>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <div className="mb-5">
          <div className="relative">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari guide, command, atau code..."
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#8B5CF6]/50"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Category — dengan jumlah guide per kategori */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => {
            const active = category === item;
            const count = item === "All" ? guides.length : categoryCounts[item] ?? 0;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  active
                    ? "bg-[#8B5CF6] text-white"
                    : "border border-white/10 text-white/50 hover:border-white/20 hover:text-white"
                }`}
              >
                {item}
                <span className={active ? "text-white/70" : "text-white/30"}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Result count */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs text-white/40">{filteredGuides.length} guide</span>
          {isFiltered && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="flex items-center gap-1 text-xs text-white/40 transition hover:text-white"
            >
              <X size={13} />
              Reset
            </button>
          )}
        </div>

        {/* Featured guide — guide terbaru ditonjolkan, mengisi ruang atas dengan sesuatu yang lebih besar */}
        {featured && (
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4"
          >
            <FeaturedGuideCard
              guide={featured}
              isOpen={openGuide === featured.id}
              onToggle={() => setOpenGuide(openGuide === featured.id ? null : featured.id)}
            />
          </motion.div>
        )}

        {/* Guide grid — 2 kolom, card berisi cuplikan kode langsung */}
        <div className="grid gap-4 lg:grid-cols-2">
          {restGuides.map((guide, index) => (
            <GuideCard
              key={guide.id}
              guide={guide}
              index={index}
              isOpen={openGuide === guide.id}
              onToggle={() => setOpenGuide(openGuide === guide.id ? null : guide.id)}
              prefersReducedMotion={!!prefersReducedMotion}
            />
          ))}
        </div>

        {/* Empty */}
        {filteredGuides.length === 0 && (
          <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 text-center">
            <p className="text-sm text-white/40">Guide tidak ditemukan.</p>
            {isFiltered && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
                className="text-xs font-medium text-[#8B5CF6] hover:text-[#A855F7]"
              >
                Reset pencarian
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// =====================================================
// Featured card — guide terbaru, full-width, dengan
// badge "Latest" dan preview kode selalu terbuka sedikit.
// =====================================================

interface GuideData {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
  content: string;
  code?: string;
  language?: string;
}

function FeaturedGuideCard({
  guide,
  isOpen,
  onToggle,
}: {
  guide: GuideData;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const accent = getCategoryColor(guide.category);

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/20">
      <div className="grid gap-0 md:grid-cols-[1.1fr_1fr]">
        {/* Left — info */}
        <button type="button" onClick={onToggle} className="flex flex-col justify-between p-6 text-left">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-[#8B5CF6]/10 px-2.5 py-1 text-[10px] font-medium text-[#8B5CF6]">
                <Sparkles size={11} />
                Latest
              </span>
              <span
                className="rounded-full px-2.5 py-1 text-[10px] font-medium"
                style={{ backgroundColor: `${accent}1A`, color: accent }}
              >
                {guide.category}
              </span>
            </div>

            <h2 className="text-xl font-semibold text-white">{guide.title}</h2>
            <p className="mt-2 text-sm leading-6 text-white/50">{guide.description}</p>
          </div>

          <div className="mt-6 flex items-center gap-4 text-xs text-white/30">
            <span>{guide.date}</span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {guide.readTime}
            </span>
            <span className="ml-auto flex items-center gap-1 font-medium" style={{ color: accent }}>
              {isOpen ? "Tutup" : "Baca selengkapnya"}
              <motion.span animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronRight size={14} />
              </motion.span>
            </span>
          </div>
        </button>

        {/* Right — cuplikan kode selalu terlihat (bukan kosong) */}
        {guide.code && (
          <div className="border-t border-white/10 md:border-l md:border-t-0">
            <CodeBlock code={guide.code} language={guide.language} compact />
          </div>
        )}
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 p-6">
              <p className="text-sm leading-7 text-white/60">{guide.content}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =====================================================
// Guide card — sekarang menampilkan cuplikan kode di
// dalam card (mengisi ruang yang tadinya kosong), bukan
// cuma judul + deskripsi + panah.
// =====================================================

function GuideCard({
  guide,
  index,
  isOpen,
  onToggle,
  prefersReducedMotion,
}: {
  guide: GuideData;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  prefersReducedMotion: boolean;
}) {
  const accent = getCategoryColor(guide.category);

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3), ease: "easeOut" }}
      className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-colors duration-300 hover:border-white/20"
    >
      <button type="button" onClick={onToggle} className="group flex items-start gap-4 p-4 text-left">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accent}1A`, color: accent }}
        >
          {guide.category === "Terminal" ? (
            <Terminal size={20} />
          ) : (
            <motion.span animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.25 }} className="flex">
              <ChevronRight size={20} />
            </motion.span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold text-white">{guide.title}</h2>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{ backgroundColor: `${accent}1A`, color: accent }}
            >
              {guide.category}
            </span>
          </div>
          <p className="line-clamp-2 text-xs leading-5 text-white/40">{guide.description}</p>
          <div className="mt-2 flex items-center gap-3 text-[10px] text-white/30">
            <span>{guide.date}</span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {guide.readTime}
            </span>
          </div>
        </div>

        <motion.span
          animate={{ rotate: isOpen ? 90 : 0, color: isOpen ? accent : "rgba(255,255,255,0.3)" }}
          transition={{ duration: 0.25 }}
          className="mt-1 shrink-0"
        >
          <ChevronRight size={16} />
        </motion.span>
      </button>

      {/* Cuplikan kode singkat — selalu terlihat, mengisi ruang kosong di bawah deskripsi */}
      {guide.code && !isOpen && (
        <div className="px-4 pb-4">
          <div className="overflow-hidden rounded-lg border border-white/10 bg-black/40">
            <pre className="overflow-hidden px-3 py-2 text-[11px] leading-5 text-white/40">
              <code className="line-clamp-2">{guide.code}</code>
            </pre>
          </div>
        </div>
      )}

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 px-5 pb-5 pt-4">
              <p className="text-sm leading-7 text-white/60">{guide.content}</p>
              {guide.code && <CodeBlock code={guide.code} language={guide.language} />}
              <div className="mt-5 border-t border-white/10 pt-3 text-[10px] text-white/30">
                Updated {guide.date}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// =====================================================
// Code block dengan tombol copy — "compact" untuk featured card
// =====================================================

function CodeBlock({
  code,
  language,
  compact = false,
}: {
  code: string;
  language?: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard tidak tersedia — abaikan secara diam-diam
    }
  };

  return (
    <div className={compact ? "flex h-full flex-col" : "mt-5 overflow-hidden rounded-lg border border-white/10"}>
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2">
        <span className="text-[10px] uppercase tracking-wide text-white/30">{language ?? "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[10px] text-white/40 transition hover:text-white"
        >
          {copied ? <Check size={12} className="text-[#10B981]" /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className={`overflow-x-auto bg-black/40 p-4 text-xs leading-6 text-white/70 ${compact ? "flex-1" : ""}`}>
        <code>{code}</code>
      </pre>
    </div>
  );
}