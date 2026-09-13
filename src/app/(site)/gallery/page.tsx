"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Images, ArrowUpRight } from "lucide-react";

import { useGallery } from "@/hook/use_gallery.hook";
import type { GalleryItem } from "@/types/gallery";
import GalleryFilterBar from "../../../components/site/gallery/GalleryFilterBar";
import GalleryGrid from "../../../components/site/gallery/GalleryGrid";
import { cinzel } from "@/lib/fonts";

// =====================================================
// CONSTANTS
// =====================================================

const COLLAGE_SIZE = 5;

// =====================================================
// HELPERS
// =====================================================

function pickRandom<T>(arr: T[], count: number): T[] {
  const copy = [...arr];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy.slice(0, count);
}

// =====================================================
// RANDOM PHOTO COLLAGE
// =====================================================

function RandomPhotoHeader({
  items,
  loading,
}: {
  items: GalleryItem[];
  loading: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();

  const [randomItems, setRandomItems] = useState<GalleryItem[]>([]);
  const hasPickedRef = useRef(false);

  useEffect(() => {
    if (
      !loading &&
      items.length > 0 &&
      !hasPickedRef.current
    ) {
      setRandomItems(
        pickRandom(
          items,
          Math.min(COLLAGE_SIZE, items.length)
        )
      );

      hasPickedRef.current = true;
    }
  }, [loading, items]);

  const rotations = useMemo(
    () =>
      randomItems.map((_, index) => {
        const values = [-4, 2, -2, 3, -3];
        return values[index] ?? 0;
      }),
    [randomItems]
  );

  if (randomItems.length === 0) {
    return null;
  }

  return (
    <div className="relative h-[280px] w-full sm:h-[340px] lg:h-[400px]">
      {/* Decorative frame */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl border border-white/[0.06]"
      />

      {/* Corner details */}
      <div
        aria-hidden
        className="absolute left-4 top-4 h-8 w-8 border-l border-t border-[#8B5CF6]/40"
      />

      <div
        aria-hidden
        className="absolute bottom-4 right-4 h-8 w-8 border-b border-r border-[#8B5CF6]/40"
      />

      {/* Label */}
      <div className="absolute left-5 top-5 z-20 flex items-center gap-2">
        <Images size={14} className="text-[#8B5CF6]" />

        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          Selected Frames
        </span>
      </div>

      {/* Photos */}
      <div className="absolute inset-0 flex items-center justify-center">
        {randomItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={
              prefersReducedMotion
                ? undefined
                : {
                    opacity: 0,
                    y: 30,
                    scale: 0.9,
                    rotate: 0,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              rotate: rotations[index],
            }}
            whileHover={
              prefersReducedMotion
                ? undefined
                : {
                    y: -12,
                    scale: 1.08,
                    rotate: 0,
                    zIndex: 30,
                  }
            }
            transition={{
              duration: 0.6,
              delay: index * 0.08,
              ease: "easeOut",
            }}
            className={`
              absolute
              overflow-hidden
              rounded-xl
              border border-white/10
              bg-[#0a0a0a]
              shadow-2xl shadow-black/60
              transition-shadow
              hover:border-white/25
              hover:shadow-[#8B5CF6]/10
              ${
                index === 0
                  ? "h-36 w-24 sm:h-48 sm:w-32 lg:h-56 lg:w-40"
                  : index === 1
                    ? "ml-[-150px] mt-8 h-28 w-20 sm:ml-[-210px] sm:h-40 sm:w-28 lg:ml-[-260px] lg:h-48 lg:w-36"
                    : index === 2
                      ? "ml-[150px] mt-6 h-28 w-20 sm:ml-[210px] sm:h-40 sm:w-28 lg:ml-[260px] lg:h-48 lg:w-36"
                      : index === 3
                        ? "ml-[-90px] mt-[-100px] h-24 w-16 sm:ml-[-130px] sm:mt-[-130px] sm:h-32 sm:w-24 lg:ml-[-170px] lg:h-40 lg:w-28"
                        : "ml-[90px] mt-[-100px] h-24 w-16 sm:ml-[130px] sm:mt-[-130px] sm:h-32 sm:w-24 lg:ml-[170px] lg:h-40 lg:w-28"
              }
            `}
          >
            <Image
              src={item.image}
              alt={item.title ?? "Gallery photo"}
              fill
              sizes="(max-width: 640px) 100px, 160px"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />

            {/* Image overlay */}
            <div className="absolute inset-0 bg-black/10 transition-colors hover:bg-transparent" />
          </motion.div>
        ))}
      </div>

      {/* Bottom label */}
      <div className="absolute bottom-5 left-5 z-20">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">
          Photography / Design / Life
        </p>
      </div>

      <div className="absolute bottom-5 right-5 z-20">
        <ArrowUpRight
          size={16}
          className="text-white/20"
        />
      </div>
    </div>
  );
}

// =====================================================
// PAGE
// =====================================================

export default function Gallery() {
  const router = useRouter();

  const {
    search,
    category,
    sortOrder,
    items,
    loading,
    error,
    isFiltered,
    setSearch,
    setCategory,
    setSortOrder,
    resetFilters,
  } = useGallery();

  // =====================================================
  // OPEN PREVIEW
  // =====================================================

  const openPreview = (item: GalleryItem) => {
    sessionStorage.setItem(
      "gallery-preview-items",
      JSON.stringify(items)
    );

    const params = new URLSearchParams({
      id: String(item.id),
    });

    router.push(
      `/gallery/preview?${params.toString()}`
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-8 sm:px-6 lg:px-10">
        {/* =================================================
            HERO
        ================================================= */}

        <section className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
          {/* Hero content */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
          >
            {/* Eyebrow */}
            <div className="mb-6 flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8B5CF6]">
                My Visual Archive
              </span>
            </div>

            {/* Title */}
            <h1
              className={`${cinzel.className} text-5xl font-medium leading-[0.95] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl xl:text-8xl`}
            >
              Gallery
              <span className="ml-2 text-[#8B5CF6]">
                .
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-lg text-sm leading-7 text-white/50 sm:text-base">
              A curated collection of moments, visual
              experiments, and creative work captured
              along the way.
            </p>

            {/* Supporting text */}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.16em] text-white/30">
              <span>Photography</span>
              <span className="text-white/10">/</span>
              <span>Design</span>
              <span className="text-white/10">/</span>
              <span>Activities</span>
            </div>

            {/* Collection count */}
            <div className="mt-10 flex items-end gap-4">
              <div>
                <div className="font-mono text-3xl font-medium text-white">
                  {loading ? "--" : String(items.length).padStart(2, "0")}
                </div>

                <div className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/30">
                  Visual Items
                </div>
              </div>

              <div className="mb-1 h-8 w-px bg-white/10" />

              <p className="max-w-[180px] text-xs leading-5 text-white/35">
                A small archive of things worth remembering.
              </p>
            </div>
          </motion.div>

          {/* Photo collage */}
          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: "easeOut",
            }}
          >
            <RandomPhotoHeader
              items={items}
              loading={loading}
            />
          </motion.div>
        </section>

        {/* =================================================
            DIVIDER
        ================================================= */}

        <div className="my-14 h-px bg-white/10" />

        {/* =================================================
            FILTER HEADER
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.45,
          }}
          className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#8B5CF6]">
              Browse Collection
            </p>

            <h2
              className={`${cinzel.className} mt-2 text-2xl text-white sm:text-3xl`}
            >
              Selected Work
            </h2>
          </div>

          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/30">
            {loading
              ? "Loading..."
              : `${items.length} items`}
          </div>
        </motion.div>

        {/* =================================================
            FILTER
        ================================================= */}

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2">
          <GalleryFilterBar
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            isFiltered={isFiltered}
            onReset={resetFilters}
            resultCount={items.length}
          />
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="mt-8">
          {/* Loading */}
          {loading && (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-[#8B5CF6]" />

                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                  Loading archive
                </span>
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/[0.03] p-5">
              <p className="text-sm text-red-400">
                Unable to load the gallery.
              </p>

              <p className="mt-1 text-xs text-white/30">
                {error}
              </p>
            </div>
          )}

          {/* Gallery */}
          {!loading && !error && (
            <GalleryGrid
              items={items}
              onSelect={openPreview}
            />
          )}
        </div>
      </div>
    </main>
  );
}