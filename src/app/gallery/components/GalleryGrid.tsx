"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { GalleryItem } from "@/data/gallery";
import { getThumbnailUrl } from "@/lib/GetThumbnailUrl";
interface GalleryGridProps {
  items: GalleryItem[];
  onSelect: (item: GalleryItem) => void;
}

const ITEMS_PER_PAGE = 12;

export default function GalleryGrid({
  items,
  onSelect,
}: GalleryGridProps) {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const visibleItems = items.slice(0, visibleCount);

  const hasMore = visibleCount < items.length;

  /*
   * Reset jumlah item ketika hasil pencarian/filter berubah.
   */
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [items]);

  /*
   * Infinite scroll
   */
  useEffect(() => {
    if (!hasMore) return;

    const loader = loaderRef.current;

    if (!loader) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting) {
          setVisibleCount((current) =>
            Math.min(
              current + ITEMS_PER_PAGE,
              items.length
            )
          );
        }
      },
      {
        rootMargin: "400px",
      }
    );

    observer.observe(loader);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, items.length]);

  if (items.length === 0) {
    return (
      <div
        className="
          flex min-h-60
          items-center justify-center
          rounded-2xl
          border border-dashed
          border-white/10
          text-sm text-slate-500
        "
      >
        Tidak ada foto yang ditemukan.
      </div>
    );
  }
  function GallerySkeleton() {
    const heights = [
      "h-32",
      "h-44",
      "h-36",
      "h-52",
      "h-40",
      "h-48",
      "h-36",
      "h-56",
      "h-44",
      "h-32",
      "h-48",
      "h-40",
    ];
    return (
      <>
        <div className="columns-3 gap-2 sm:columns-3 md:columns-4">
          {heights.map((height, index) => (
            <div
              key={index}
              className={`
                mb-2
                break-inside-avoid
                overflow-hidden
                rounded-lg
                border border-white/5
                bg-slate-900
                ${height}
                animate-pulse
              `}
            >
              <div className="h-full w-full bg-white/[0.04]" />
            </div>
          ))}
        </div>

        {/* Infinite scroll trigger */}
        {hasMore && (
        <>
          <GallerySkeleton />

          <div className="flex h-8 items-center justify-center">
            <div
              className="
                h-4 w-4
                animate-spin
                rounded-full
                border-2
                border-white/10
                border-t-cyan-400
              "
            />
          </div>
        </>
      )}
      </>
    );
  }

  interface GalleryCardProps {
    item: GalleryItem;
    onSelect: (item: GalleryItem) => void;
  }

  function GalleryCard({
    item,
    onSelect,
  }: GalleryCardProps) {
    return (
      <button
        type="button"
        onClick={() => onSelect(item)}
        className="
          group relative mb-3
          block w-full
          break-inside-avoid
          overflow-hidden
          rounded-lg
          border border-white/10
          bg-slate-900
          text-left
          outline-none
          focus:ring-2
          focus:ring-cyan-400/50
        "
      >
        <div className="relative">
          <Image
            src={getThumbnailUrl(item.image, 400)}
            alt={item.title}
            width={400}
            height={400}
            sizes="
              (max-width: 640px) 50vw,
              (max-width: 1024px) 33vw,
              25vw
            "
            draggable={false}
            className="
              h-auto
              w-full
              select-none
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />

          {/* Overlay */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-t
              from-black/80
              via-black/10
              to-transparent
              opacity-0
              transition-opacity
              duration-300
              group-hover:opacity-100
            "
          />

          {/* Info */}
          <div
            className="
              absolute bottom-0 left-0 right-0
              translate-y-2
              p-3
              opacity-0
              transition-all
              duration-300
              group-hover:translate-y-0
              group-hover:opacity-100
            "
          >
            <p className="text-xs font-semibold text-white">
              {item.title}
            </p>

            <p className="mt-1 text-[10px] text-slate-300">
              {item.category}
            </p>
          </div>
        </div>
      </button>
    );
  }
}