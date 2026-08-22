"use client";

import { useRef, useState } from "react";

import type { GalleryItem } from "@/data/gallery";

/* -------------------------------------------------------------------------- */
/* Slide                                                                       */
/*                                                                              */
/* Tinggi slide di mobile ikut aspect ratio FOTO ASLINYA (bukan dipaksa       */
/* setinggi layar) — supaya feed tidak banyak ruang kosong. Tapi supaya       */
/* scroll tetap akurat sebelum gambar selesai load (lihat riwayat perbaikan  */
/* di GalleryPreviewPage), container tetap punya tinggi *placeholder* yang   */
/* deterministik lewat CSS `aspect-ratio`:                                   */
/*                                                                              */
/*  - Sebelum gambar selesai load: pakai FALLBACK_ASPECT_RATIO (perkiraan). */
/*  - Begitu gambar selesai load: aspect-ratio diganti ke rasio asli         */
/*    (naturalWidth / naturalHeight), lalu onImageSettled() dipanggil        */
/*    supaya GalleryPreviewPage bisa mengoreksi ulang posisi scroll kalau    */
/*    ternyata rasio aslinya beda dari fallback.                             */
/*                                                                              */
/* Desktop TIDAK memakai aspect-ratio ini — desktop tetap full-height        */
/* snap-section seperti sebelumnya (isDesktop=true menonaktifkan style ini). */
/*                                                                              */
/* Root <div> ini juga HARUS jadi direct child dari feed container di        */
/* GalleryPreviewPage (jangan dibungkus Fragment / elemen lain di atasnya),  */
/* karena parent mengakses slide lewat `container.children[index]`.          */
/* -------------------------------------------------------------------------- */

const FALLBACK_ASPECT_RATIO = 4 / 3;

interface SlideProps {
  slide: GalleryItem;
  isTouchDevice: boolean;
  isDesktop: boolean;
  shouldLoad: boolean;
  onImageSettled: () => void;
}

export function Slide({
  slide,
  isTouchDevice,
  isDesktop,
  shouldLoad,
  onImageSettled,
}: SlideProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(FALLBACK_ASPECT_RATIO);

  const lastTapRef = useRef(0);

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;

    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      setAspectRatio(img.naturalWidth / img.naturalHeight);
    }

    setIsLoaded(true);

    /*
     * onImageSettled dipanggil SETELAH aspectRatio di-set, tapi state
     * update React tidak sinkron — parent baru tahu tinggi final-nya
     * di render berikutnya. Itu sebabnya koreksi scroll di parent tetap
     * dilakukan lewat requestAnimationFrame, bukan langsung.
     */
    onImageSettled();
  };

  const handleError = () => {
    setHasError(true);

    /*
     * Tetap panggil onImageSettled walau gagal, supaya
     * pendingScrollIndexRef di parent tidak nyangkut nunggu
     * gambar yang tidak akan pernah selesai load.
     */
    onImageSettled();
  };

  const handleDoubleTap = () => {
    if (!isTouchDevice || !isLoaded) return;

    setIsZoomed((prev) => !prev);
  };

  const handlePointerUp = () => {
    if (!isTouchDevice) return;

    const now = Date.now();

    if (now - lastTapRef.current < 280) {
      handleDoubleTap();
    }

    lastTapRef.current = now;
  };

  return (
    <div
      data-slide-image={slide.image}
      className="
        relative
        flex
        w-full
        shrink-0
        items-center
        justify-center
        overflow-hidden
        bg-slate-950
        lg:h-full
        lg:min-h-0
        lg:shrink-0
        lg:snap-start
        lg:snap-always
      "
      style={!isDesktop ? { aspectRatio: String(aspectRatio) } : undefined}
    >
      {/* Skeleton — sebelum gambar boleh dimuat / sebelum selesai load */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-slate-900" />
      )}

      {hasError && (
        <div className="relative z-10 flex flex-col items-center gap-1 px-6 text-center text-sm text-slate-500">
          <span>Gagal memuat gambar.</span>
        </div>
      )}

      {shouldLoad && !hasError && (
        <img
          src={slide.image}
          alt={slide.title}
          loading="eager"
          decoding="async"
          draggable={false}
          onLoad={handleLoad}
          onError={handleError}
          onPointerUp={handlePointerUp}
          className={`
            relative
            z-10
            h-full
            w-full
            select-none
            object-cover
            transition-opacity
            duration-300
            lg:h-auto
            lg:max-h-full
            lg:w-auto
            lg:max-w-full
            lg:object-contain
            ${isLoaded ? "opacity-100" : "opacity-0"}
            ${isZoomed ? "scale-[2]" : "scale-100"}
            ${isTouchDevice ? (isZoomed ? "cursor-zoom-out" : "cursor-zoom-in") : ""}
          `}
          style={{
            transition: "transform 200ms ease, opacity 300ms ease",
          }}
        />
      )}

      {/* Caption — cuma di mobile, desktop sudah punya sidebar */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          z-10
          bg-gradient-to-t
          from-black/70
          to-transparent
          px-4
          py-3
          lg:hidden
        "
      >
        <p className="truncate text-sm font-medium text-white">{slide.title}</p>
        <p className="truncate text-xs text-slate-300">{slide.category}</p>
      </div>
    </div>
  );
}