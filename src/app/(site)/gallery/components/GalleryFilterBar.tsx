"use client";

import {
  Search,
  CalendarDays,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

import type { GalleryCategory } from "@/data/gallery";
import type { SortOrder } from "@/app/(site)/gallery/types";

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
  const [showFilter, setShowFilter] = useState(false);

  const isFiltered =
    search !== "" ||
    category !== "All" ||
    sortOrder !== "newest";

  return (
    <div className="mb-6">
      {/* Main Bar */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="
              pointer-events-none
              absolute left-3 top-1/2
              -translate-y-1/2
              text-slate-500
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari foto..."
            className="
              h-9 w-full
              rounded-md
              border border-white/10
              bg-slate-900/70
              pl-9 pr-8
              text-sm text-white
              outline-none
              placeholder:text-slate-600
              transition
              focus:border-cyan-400/50
              focus:bg-slate-900
            "
          />

          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="
                absolute right-2 top-1/2
                flex h-5 w-5
                -translate-y-1/2
                items-center justify-center
                rounded
                text-slate-500
                transition
                hover:bg-white/10
                hover:text-white
              "
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filter Button */}
        <button
          type="button"
          onClick={() => setShowFilter((prev) => !prev)}
          className={`
            relative
            flex h-9 shrink-0
            items-center gap-2
            rounded-md
            border
            px-3
            text-xs font-medium
            transition-all

            ${
              showFilter || isFiltered
                ? `
                  border-cyan-400/30
                  bg-cyan-400/10
                  text-cyan-400
                `
                : `
                  border-white/10
                  bg-slate-900/70
                  text-slate-400
                  hover:border-white/20
                  hover:bg-white/5
                  hover:text-white
                `
            }
          `}
        >
          <SlidersHorizontal size={14} />

          <span className="hidden sm:inline">
            Filter
          </span>

          {/* Active indicator */}
          {isFiltered && (
            <span
              className="
                absolute
                -right-1 -top-1
                h-2 w-2
                rounded-full
                bg-cyan-400
                ring-2
                ring-slate-950
              "
            />
          )}
        </button>

        {/* Result */}
        <span className="hidden shrink-0 text-xs text-slate-500 sm:block">
          {resultCount} foto
        </span>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div
          className="
            mt-2
            rounded-xl
            border border-white/10
            bg-slate-900/80
            p-3
            shadow-xl
            shadow-black/10
            backdrop-blur-xl
          "
        >
          {/* Category */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-600
                "
              >
                Category
              </span>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {categories.map((item) => {
                const active = category === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onCategoryChange(item)}
                    className={`
                      whitespace-nowrap
                      rounded-md
                      px-3
                      py-1.5
                      text-xs
                      font-medium
                      transition-all

                      ${
                        active
                          ? `
                            bg-cyan-400
                            text-slate-950
                            shadow-lg
                            shadow-cyan-400/10
                          `
                          : `
                            border border-white/10
                            bg-white/[0.03]
                            text-slate-500
                            hover:border-white/20
                            hover:bg-white/5
                            hover:text-white
                          `
                      }
                    `}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="my-3 h-px bg-white/5" />

          {/* Sort */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <CalendarDays
                size={13}
                className="text-slate-600"
              />

              <span
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-600
                "
              >
                Urutkan
              </span>
            </div>

            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() =>
                  onSortOrderChange("newest")
                }
                className={`
                  rounded-md
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  transition-all

                  ${
                    sortOrder === "newest"
                      ? `
                        bg-white/10
                        text-white
                      `
                      : `
                        text-slate-500
                        hover:bg-white/5
                        hover:text-white
                      `
                  }
                `}
              >
                Terbaru
              </button>

              <button
                type="button"
                onClick={() =>
                  onSortOrderChange("oldest")
                }
                className={`
                  rounded-md
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  transition-all

                  ${
                    sortOrder === "oldest"
                      ? `
                        bg-white/10
                        text-white
                      `
                      : `
                        text-slate-500
                        hover:bg-white/5
                        hover:text-white
                      `
                  }
                `}
              >
                Terlama
              </button>
            </div>
          </div>

          {/* Bottom */}
          {isFiltered && (
            <>
              <div className="my-3 h-px bg-white/5" />

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">
                  {resultCount} foto ditemukan
                </span>

                <button
                  type="button"
                  onClick={onReset}
                  className="
                    flex
                    items-center
                    gap-1
                    rounded-md
                    px-2
                    py-1.5
                    text-xs
                    text-slate-500
                    transition
                    hover:bg-white/5
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
      )}
    </div>
  );
}