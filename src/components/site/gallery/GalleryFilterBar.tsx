"use client";

import {
  Search,
  CalendarDays,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import type {
  GalleryCategory,
  SortOrder,
} from "@/types/gallery";

const categories: ("All" | GalleryCategory)[] = [
  "All",
  "Photography",
  "Design",
];

interface GalleryFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: "All" | GalleryCategory;
  onCategoryChange: (
    value: "All" | GalleryCategory
  ) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (value: SortOrder) => void;
  resultCount: number;
  isFiltered: boolean;
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

  const hasActiveFilter =
    search !== "" ||
    category !== "All" ||
    sortOrder !== "newest";

  return (
    <div className="w-full">
      {/* =================================================
          MAIN TOOLBAR
      ================================================= */}

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="group relative min-w-0 flex-1">
          <Search
            size={14}
            aria-hidden
            className="
              pointer-events-none
              absolute left-3 top-1/2
              -translate-y-1/2
              text-white/25
              transition-colors
              group-focus-within:text-[#8B5CF6]
            "
          />

          <input
            type="search"
            value={search}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            placeholder="Search collection..."
            aria-label="Search gallery"
            className="
              h-10
              w-full
              rounded-lg
              border border-white/10
              bg-white/[0.025]
              pl-9
              pr-9
              text-xs
              text-white
              outline-none
              placeholder:text-white/25
              transition-all
              focus:border-[#8B5CF6]/40
              focus:bg-white/[0.04]
              focus:ring-1
              focus:ring-[#8B5CF6]/10
            "
          />

          {/* Clear search */}
          <AnimatePresence>
            {search && (
              <motion.button
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                }}
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
                className="
                  absolute right-2 top-1/2
                  flex h-6 w-6
                  -translate-y-1/2
                  items-center justify-center
                  rounded-md
                  text-white/30
                  transition-colors
                  hover:bg-white/10
                  hover:text-white
                "
              >
                <X size={12} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Filter button */}
        <button
          type="button"
          onClick={() =>
            setShowFilter((prev) => !prev)
          }
          aria-expanded={showFilter}
          aria-label="Toggle gallery filters"
          className={`
            relative
            flex h-10
            shrink-0
            items-center
            gap-2
            rounded-lg
            border
            px-3
            text-xs
            font-medium
            transition-all
            ${
              showFilter || hasActiveFilter
                ? `
                  border-[#8B5CF6]/30
                  bg-[#8B5CF6]/10
                  text-[#8B5CF6]
                `
                : `
                  border-white/10
                  bg-white/[0.025]
                  text-white/40
                  hover:border-white/20
                  hover:bg-white/[0.04]
                  hover:text-white
                `
            }
          `}
        >
          <SlidersHorizontal size={14} />

          <span className="hidden sm:inline">
            Filters
          </span>

          {/* Active indicator */}
          {hasActiveFilter && (
            <span
              aria-hidden
              className="
                absolute
                -right-1
                -top-1
                h-2
                w-2
                rounded-full
                bg-[#8B5CF6]
                ring-2
                ring-[#050505]
              "
            />
          )}
        </button>

        {/* Result count */}
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <span className="h-3 w-px bg-white/10" />

          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/25">
            {resultCount} items
          </span>
        </div>
      </div>

      {/* =================================================
          FILTER PANEL
      ================================================= */}

      <AnimatePresence initial={false}>
        {showFilter && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
              y: -8,
            }}
            animate={{
              opacity: 1,
              height: "auto",
              y: 0,
            }}
            exit={{
              opacity: 0,
              height: 0,
              y: -8,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-xl border border-white/10 bg-[#080808] p-4">
              {/* =========================================
                  CATEGORY
              ========================================= */}

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">
                      Category
                    </span>

                    <p className="mt-1 text-[11px] text-white/40">
                      Browse by type
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((item) => {
                    const active = category === item;

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          onCategoryChange(item)
                        }
                        className={`
                          rounded-lg
                          border
                          px-3
                          py-2
                          text-[11px]
                          font-medium
                          transition-all
                          ${
                            active
                              ? `
                                border-[#8B5CF6]/30
                                bg-[#8B5CF6]/10
                                text-[#8B5CF6]
                              `
                              : `
                                border-white/10
                                bg-white/[0.02]
                                text-white/40
                                hover:border-white/20
                                hover:bg-white/[0.04]
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
              <div className="my-5 h-px bg-white/[0.06]" />

              {/* =========================================
                  SORT
              ========================================= */}

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <CalendarDays
                    size={13}
                    className="text-white/25"
                  />

                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">
                      Sort by
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onSortOrderChange("newest")
                    }
                    className={`
                      rounded-lg
                      border
                      px-3
                      py-2
                      text-[11px]
                      font-medium
                      transition-all
                      ${
                        sortOrder === "newest"
                          ? `
                            border-white/15
                            bg-white/10
                            text-white
                          `
                          : `
                            border-transparent
                            text-white/35
                            hover:bg-white/[0.04]
                            hover:text-white
                          `
                      }
                    `}
                  >
                    Newest
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onSortOrderChange("oldest")
                    }
                    className={`
                      rounded-lg
                      border
                      px-3
                      py-2
                      text-[11px]
                      font-medium
                      transition-all
                      ${
                        sortOrder === "oldest"
                          ? `
                            border-white/15
                            bg-white/10
                            text-white
                          `
                          : `
                            border-transparent
                            text-white/35
                            hover:bg-white/[0.04]
                            hover:text-white
                          `
                      }
                    `}
                  >
                    Oldest
                  </button>
                </div>
              </div>

              {/* =========================================
                  ACTIVE FILTER FOOTER
              ========================================= */}

              <AnimatePresence>
                {hasActiveFilter && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                    }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 border-t border-white/[0.06] pt-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/20">
                            Current result
                          </span>

                          <p className="mt-1 text-xs text-white/40">
                            {resultCount}{" "}
                            {resultCount === 1
                              ? "item"
                              : "items"}{" "}
                            found
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={onReset}
                          className="
                            flex
                            items-center
                            gap-1.5
                            rounded-lg
                            border
                            border-white/10
                            px-3
                            py-2
                            text-[10px]
                            font-medium
                            text-white/35
                            transition-all
                            hover:border-red-400/20
                            hover:bg-red-400/5
                            hover:text-red-400
                          "
                        >
                          <X size={11} />

                          Clear
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}