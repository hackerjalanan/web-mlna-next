"use client";

import { CalendarDays, Search, SlidersHorizontal, X } from "lucide-react";
import { SortOption } from "@/types/projects";

const sortOptions = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "name", label: "Nama A-Z" },
] as const;

interface Props {
  search: string;
  setSearch: (v: string) => void;
  categories: string[];
  activeCategory: string;
  setActiveCategory: (v: string) => void;
  sortBy: SortOption;
  setSortBy: (v: SortOption) => void;
  showFilter: boolean;
  setShowFilter: (v: boolean) => void;
  loadingCategories: boolean;
  filteredCount: number;
  isFiltered: boolean;
  resetFilters: () => void;
}

export default function ProjectFilters({
  search,
  setSearch,
  categories,
  activeCategory,
  setActiveCategory,
  sortBy,
  setSortBy,
  showFilter,
  setShowFilter,
  loadingCategories,
  filteredCount,
  isFiltered,
  resetFilters,
}: Props) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari proyek..."
            className="h-9 w-full rounded-md border border-white/10 bg-slate-900/70 pl-9 pr-8 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500">
              <X size={13} />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowFilter(!showFilter)}
          className={`relative flex h-9 items-center gap-2 rounded-md border px-3 text-xs font-medium ${
            showFilter || isFiltered
              ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-400"
              : "border-white/10 bg-slate-900/70 text-slate-400"
          }`}
        >
          <SlidersHorizontal size={14} />
          <span className="hidden sm:inline">Filter</span>
          {isFiltered && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-cyan-400" />}
        </button>

        <span className="hidden text-xs text-slate-500 sm:block">{filteredCount} proyek</span>
      </div>

      {showFilter && (
        <div className="mt-2 rounded-xl border border-white/10 bg-slate-900/80 p-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
            Kategori
          </span>

          <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
            {loadingCategories ? (
              <span className="px-3 py-1.5 text-xs text-slate-500">Memuat kategori...</span>
            ) : (
              categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveCategory(item)}
                  className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium ${
                    activeCategory === item
                      ? "bg-cyan-400 text-slate-950"
                      : "border border-white/10 text-slate-500 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))
            )}
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
                  onClick={() => setSortBy(option.value)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium ${
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
                <span className="text-xs text-slate-600">{filteredCount} proyek ditemukan</span>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-slate-500 hover:text-white"
                >
                  <X size={12} /> Reset
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}