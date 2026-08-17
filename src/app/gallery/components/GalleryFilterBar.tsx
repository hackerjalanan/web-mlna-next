"use client";

import { Search, CalendarDays, X } from "lucide-react";
import type { GalleryCategory } from "@/data/gallery";
import type { SortOrder } from "@/app/gallery/types";

const categories: ("All" | GalleryCategory)[] = [
  "All",
  "Photography",
  "Design",
  "Project",
  "Activity",
];

interface GalleryFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: "All" | GalleryCategory;
  onCategoryChange: (value: "All" | GalleryCategory) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (value: SortOrder) => void;
  resultCount: number;
  onReset: () => void;
}

export default function GalleryFilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sortOrder,
  onSortOrderChange,
  resultCount,
  onReset,
}: GalleryFilterBarProps) {
  const isFiltered = search !== "" || category !== "All";

  return (
    <>
      {/* Filter */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari foto..."
              className="
                w-full rounded-xl
                border border-white/10
                bg-slate-950/70
                py-2.5 pl-10 pr-4
                text-sm text-white
                outline-none
                placeholder:text-slate-500
                focus:border-cyan-400/50
              "
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <CalendarDays size={17} className="text-slate-500" />

            <select
              value={sortOrder}
              onChange={(e) =>
                onSortOrderChange(e.target.value as SortOrder)
              }
              className="
                rounded-xl
                border border-white/10
                bg-slate-950/70
                px-3 py-2.5
                text-sm text-white
                outline-none
              "
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
            </select>
          </div>
        </div>

        {/* Category */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onCategoryChange(item)}
              className={`
                whitespace-nowrap rounded-full
                px-4 py-2 text-xs font-medium
                transition-all
                ${
                  category === item
                    ? "bg-cyan-400 text-slate-950"
                    : "border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-slate-500">{resultCount} foto</span>

        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
          >
            <X size={14} />
            Reset
          </button>
        )}
      </div>
    </>
  );
}