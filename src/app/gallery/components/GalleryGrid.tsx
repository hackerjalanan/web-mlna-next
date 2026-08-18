"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { GalleryItem } from "@/data/gallery";
import { getThumbnailUrl } from "@/lib/GetThumbnailUrl";

interface GalleryGridProps {
  items: GalleryItem[];
  onSelect: (item: GalleryItem) => void;
}

interface GalleryCardProps {
  item: GalleryItem;
  onSelect: (item: GalleryItem) => void;
}

type HoverDirection = "left" | "right" | "top" | "bottom";

const ITEMS_PER_PAGE = 12;

function getDirection(
  e: React.PointerEvent<HTMLButtonElement>
): HoverDirection {
  const rect = e.currentTarget.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const distanceX = Math.abs(x - centerX);
  const distanceY = Math.abs(y - centerY);

  if (distanceX > distanceY) {
    return x < centerX ? "left" : "right";
  }

  return y < centerY ? "top" : "bottom";
}

function GalleryCard({ item, onSelect }: GalleryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Arah saat overlay masuk
  const [enterDirection, setEnterDirection] =
    useState<HoverDirection>("left");

  // Arah saat overlay keluar
  const [exitDirection, setExitDirection] =
    useState<HoverDirection>("left");

  const handlePointerEnter = (
    e: React.PointerEvent<HTMLButtonElement>
  ) => {
    const direction = getDirection(e);

    setEnterDirection(direction);
    setIsHovered(true);
  };

  const handlePointerLeave = (
    e: React.PointerEvent<HTMLButtonElement>
  ) => {
    const direction = getDirection(e);

    setExitDirection(direction);
    setIsHovered(false);
  };

  const getOverlayTransform = () => {
    if (isHovered) {
      return "translate-x-0 translate-y-0";
    }

    switch (exitDirection) {
      case "left":
        return "-translate-x-full";

      case "right":
        return "translate-x-full";

      case "top":
        return "-translate-y-full";

      case "bottom":
        return "translate-y-full";
    }
  };

  const getTitleTransform = () => {
    if (isHovered) {
      return "translate-x-0 translate-y-0 opacity-100";
    }

    switch (exitDirection) {
      case "left":
        return "-translate-x-8 translate-y-0 opacity-0";

      case "right":
        return "translate-x-8 translate-y-0 opacity-0";

      case "top":
        return "translate-x-0 -translate-y-8 opacity-0";

      case "bottom":
        return "translate-x-0 translate-y-8 opacity-0";
    }
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
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
      <div className="relative overflow-hidden">
        {/* Skeleton placeholder, hilang begitu gambar selesai dimuat */}
        {!isLoaded && (
          <div className="absolute inset-0 min-h-40 animate-pulse bg-white/[0.04]" />
        )}

        <Image
          src={getThumbnailUrl(item.image, 400)}
          alt={item.title}
          width={400}
          height={400}
          sizes="
            (max-width: 640px) 33vw,
            (max-width: 1024px) 33vw,
            25vw
          "
          draggable={false}
          onLoad={() => setIsLoaded(true)}
          className={`
            h-auto
            w-full
            select-none
            object-cover
            transition-[opacity,transform]
            duration-700
            ease-out
            will-change-transform
            group-hover:scale-105
            group-hover:duration-500
            group-hover:ease-[cubic-bezier(0.25,0.8,0.25,1)]
            ${isLoaded ? "opacity-100" : "opacity-0"}
          `}
        />

        {/* Overlay */}
        <div
          className={`
            pointer-events-none
            absolute inset-0
            bg-black/40
            transition-transform
            duration-500
            ease-out

            ${
              isHovered
                ? "translate-x-0 translate-y-0"
                : getOverlayTransform()
            }
          `}
        />

        {/* Title */}
        <div
          className="
            pointer-events-none
            absolute inset-0
            flex items-center
            justify-center
            overflow-hidden
          "
        >
          <h3
            className={`
              max-w-[85%]
              text-center
              text-lg
              font-bold
              leading-tight
              text-white
              drop-shadow-lg
              transition-all
              duration-500
              ease-out
              sm:text-xl
              md:text-2xl

              ${
                isHovered
                  ? "translate-x-0 translate-y-0 opacity-100"
                  : getTitleTransform()
              }
            `}
          >
            {item.title}
          </h3>
        </div>
      </div>
    </button>
  );
}

export default function GalleryGrid({ items, onSelect }: GalleryGridProps) {
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
            Math.min(current + ITEMS_PER_PAGE, items.length)
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

  return (
    <>
      <div className="columns-3 gap-2 sm:columns-3 md:columns-4">
        {visibleItems.map((item) => (
          <GalleryCard key={item.image} item={item} onSelect={onSelect} />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div ref={loaderRef} className="flex h-8 items-center justify-center">
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
      )}
    </>
  );
}