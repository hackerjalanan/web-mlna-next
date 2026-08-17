"use client";

import Image from "next/image";
import type { GalleryItem } from "@/data/gallery";

interface GalleryGridProps {
  items: GalleryItem[];
  onSelect: (item: GalleryItem) => void;
}

export default function GalleryGrid({ items, onSelect }: GalleryGridProps) {
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

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item)}
          className="
            group relative
            overflow-hidden
            rounded-2xl
            border border-white/10
            bg-slate-900
            text-left
            outline-none
            focus:ring-2
            focus:ring-cyan-400/50
          "
        >
          <div className="relative aspect-square">
            <Image
              src={item.image}
              alt={item.title}
              fill
              draggable={false}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="
                object-cover
                transition-transform
                duration-500
                group-hover:scale-110
                select-none
              "
            />

            {/* Overlay */}
            <div
              className="
                absolute inset-0
                bg-gradient-to-t
                from-black/80
                via-transparent
                to-transparent
                opacity-0
                transition-opacity
                duration-300
                group-hover:opacity-100
              "
            />

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
      ))}
    </div>
  );
}