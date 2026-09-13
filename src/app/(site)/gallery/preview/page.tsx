"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { getThumbnailUrl } from "@/lib/GetThumbnailUrl";
import type { GalleryItem } from "@/types/gallery";
import Loading from "@/context/Loading";

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

  const handlePrev = () => hasPrev && goTo(currentIndex - 1);
  const handleNext = () => hasNext && goTo(currentIndex + 1);

  useEffect(() => {
    setLoaded(false);
  }, [currentItem?.id]);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [currentIndex, items]);

  if (!currentItem) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#050505]">
        <p className="text-sm text-white/40">Gambar tidak ditemukan</p>
      </div>
    );
  }

  const imageSrc = getThumbnailUrl(currentItem.image, 1600);

  return (
    <div className="min-h-screen w-full bg-[#050505]">
      <div className="mx-auto flex max-w-[1440px] flex-col">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </button>

          <span className="text-xs text-white/30">
            {currentIndex + 1} / {items.length}
          </span>

          <button
            onClick={() => router.back()}
            className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="flex flex-col gap-6 px-4 pb-10 sm:px-6 lg:flex-row lg:gap-10 lg:px-10">
          {/* IMAGE AREA */}
          <div className="relative flex flex-1 items-center justify-center">
            <div className="relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-white/[0.02]">
              {!loaded && (
                <div className="flex min-h-[320px] w-full items-center justify-center py-24">
                  <Loading size={28} label="" />
                </div>
              )}

              <img
                key={currentItem.id}
                src={imageSrc}
                alt={currentItem.title}
                onLoad={() => setLoaded(true)}
                className={`max-h-[75vh] w-auto max-w-full rounded-xl object-contain transition-opacity duration-300 ${
                  loaded ? "opacity-100" : "absolute opacity-0"
                }`}
              />
            </div>

            {hasPrev && (
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              >
                <ChevronLeft />
              </button>
            )}

            {hasNext && (
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              >
                <ChevronRight />
              </button>
            )}
          </div>

          {/* INFO */}
          <aside className="w-full shrink-0 border-t border-white/10 pt-5 lg:w-[340px] lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <span className="rounded-md border border-[#A855F7]/30 bg-[#A855F7]/10 px-2.5 py-1 text-xs font-medium text-[#A78BFA]">
              {currentItem.category}
            </span>

            <h2 className="mt-3 text-lg font-semibold text-white">
              {currentItem.title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/45">
              {currentItem.description}
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function GalleryPreview() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center bg-[#050505]">
          <Loading size={28} label="Memuat galeri..." />
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}