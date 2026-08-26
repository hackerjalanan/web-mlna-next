"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, Image as ImageIcon, FileText, X } from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { getThumbnailUrl } from "@/lib/GetThumbnailUrl";
import type { GalleryItem } from "@/types/gallery";

function PreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const idParam = searchParams.get("id");

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("gallery-preview-items");

      if (raw) {
        setItems(JSON.parse(raw));
      }
    } catch {
      setItems([]);
    }
  }, []);

  const currentIndex = useMemo(() => {
    if (!idParam || items.length === 0) {
      return -1;
    }

    return items.findIndex((item) => String(item.id) === idParam);
  }, [items, idParam]);

  const currentItem = currentIndex >= 0 ? items[currentIndex] : null;

  const hasPrev = currentIndex > 0;

  const hasNext = currentIndex >= 0 && currentIndex < items.length - 1;

  const goTo = (index: number) => {
    const target = items[index];

    if (!target) return;

    setLoaded(false);

    router.replace(`/gallery/preview?id=${target.id}`);
  };

  const handlePrev = () => {
    if (hasPrev) {
      goTo(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      goTo(currentIndex + 1);
    }
  };

  useEffect(() => {
    setLoaded(false);
  }, [currentItem?.id]);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.back();
      }

      if (e.key === "ArrowLeft") {
        handlePrev();
      }

      if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [currentIndex, items]);

  if (!currentItem) {
    return (
      <div className="flex h-full w-full items-center justify-center overscroll-none bg-black/95">
        <p className="text-sm text-slate-400">Gambar tidak ditemukan</p>
      </div>
    );
  }

  const imageSrc = getThumbnailUrl(currentItem.image, 1600);
return (
  <div className="relative flex mx-auto max-w-[1440px] h-full min-h-0 flex-col overflow-hidden">

    {/* HEADER */}
    <div className="flex shrink-0 items-center justify-between px-4 py-2">

      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </button>

      <span className="text-xs text-slate-500">
        {currentIndex + 1} / {items.length}
      </span>

      <button onClick={() => router.back()} className="rounded-full p-2 text-slate-300 hover:bg-white/10 hover:text-white">
        <X className="h-5 w-5" />
      </button>

    </div>


    {/* CONTENT */}
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">


      {/* IMAGE AREA */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-2 pb-2">

        <div className="relative flex h-full min-h-0 w-full items-center justify-center">

          {!loaded && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400" />
            </div>
          )}


          <img
            key={currentItem.id}
            src={imageSrc}
            alt={currentItem.title}
            onLoad={() => setLoaded(true)}
            className={`max-h-full max-w-full rounded-lg object-contain shadow-2xl transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          />

        </div>


        {hasPrev && (
          <button onClick={handlePrev} className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70">
            <ChevronLeft />
          </button>
        )}


        {hasNext && (
          <button onClick={handleNext} className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70">
            <ChevronRight />
          </button>
        )}

      </div>



      {/* INFO */}
      <aside className="max-h-fit shrink-0 overflow-y-auto border-t border-white/10 px-4 py-3 md:w-[360px] md:border-l md:border-t-0 md:px-6 md:py-6">

        <span className="rounded-full bg-cyan-400/10 px-2 py-1 text-xs text-cyan-400">
          {currentItem.category}
        </span>

        <h2 className="mt-2 text-lg font-semibold text-white">
          {currentItem.title}
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          {currentItem.description}
        </p>

      </aside>
      <aside className="max-h-fit shrink-0 overflow-y-auto border-t border-white/10 px-4 py-3 md:hidden">

        <span className="rounded-full bg-cyan-400/10 px-2 py-1 text-xs text-cyan-400">
          {currentItem.category}
        </span>

        <h2 className="mt-2 text-lg font-semibold text-white">
          {currentItem.title}
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          {currentItem.description}
        </p>

      </aside>
    </div>

  </div>
);
}
export default function GalleryPreview() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center overflow-hidden bg-black">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}