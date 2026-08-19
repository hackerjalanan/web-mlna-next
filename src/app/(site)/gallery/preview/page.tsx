
"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, ChevronUp, ChevronDown } from "lucide-react";

import { galleryItems, type GalleryItem } from "@/data/gallery";
import { getThumbnailUrl } from "@/lib/GetThumbnailUrl";
import { Slide } from "./Slide";

/* -------------------------------------------------------------------------- */
/* Touch device                                                               */
/* -------------------------------------------------------------------------- */

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");

    const update = () => {
      setIsTouch(mediaQuery.matches);
    };

    update();

    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);

  return isTouch;
}

/* -------------------------------------------------------------------------- */
/* Desktop viewport (disamakan dengan breakpoint `lg` Tailwind = 1024px)      */
/*                                                                            */
/* Dipakai untuk memutuskan: apakah preview jadi overlay fullscreen (desktop) */
/* atau halaman biasa yang scroll bebas (mobile).                            */
/* -------------------------------------------------------------------------- */

function useIsDesktopViewport() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const update = () => {
      setIsDesktop(mediaQuery.matches);
    };

    update();

    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);

  return isDesktop;
}

/* -------------------------------------------------------------------------- */
/* Gallery Preview                                                            */
/* -------------------------------------------------------------------------- */

function GalleryPreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const src = searchParams.get("src");

  const isTouchDevice = useIsTouchDevice();
  const isDesktop = useIsDesktopViewport();

  const feedRef = useRef<HTMLDivElement | null>(null);

  /*
   * Cari item awal berdasarkan URL.
   */
  const initialItem =
    galleryItems.find((galleryItem) => galleryItem.image === src) ?? null;

  /*
   * Semua foto dari kategori yang sama.
   */
  const items = initialItem
    ? galleryItems.filter(
        (galleryItem) => galleryItem.category === initialItem.category
      )
    : [];

  const initialIndex = initialItem
    ? Math.max(
        0,
        items.findIndex((galleryItem) => galleryItem.image === initialItem.image)
      )
    : 0;

  /*
   * Index aktif disimpan secara lokal.
   *
   * Jadi scroll tidak perlu mengubah searchParams
   * menggunakan router.replace().
   */
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  /*
   * Kalau URL berubah dari luar, sinkronkan index.
   */
  useEffect(() => {
    if (!src) return;

    const index = items.findIndex((galleryItem) => galleryItem.image === src);

    if (index >= 0) {
      setCurrentIndex(index);
    }
  }, [src, items]);

  /*
   * Item aktif.
   */
  const item = items[currentIndex] ?? null;

  const hasPrev = currentIndex > 0;

  const hasNext = currentIndex >= 0 && currentIndex < items.length - 1;

  /* ------------------------------------------------------------------------ */
  /* Invalid src                                                               */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (src && !initialItem) {
      router.replace("/gallery");
    }
  }, [src, initialItem, router]);

  /* ------------------------------------------------------------------------ */
  /* Update URL tanpa navigasi Next.js                                        */
  /* ------------------------------------------------------------------------ */

  const updateUrl = (target: GalleryItem) => {
    const url = `/gallery/preview?src=${encodeURIComponent(target.image)}`;

    /*
     * PENTING:
     *
     * Jangan gunakan router.replace() saat scrolling.
     *
     * history.replaceState tidak melakukan request
     * / navigasi RSC Next.js.
     */
    window.history.replaceState(window.history.state, "", url);
  };

  /* ------------------------------------------------------------------------ */
  /* Scroll                                                                    */
  /* ------------------------------------------------------------------------ */

  const scrollToIndex = (index: number, behavior: ScrollBehavior = "smooth") => {
    const container = feedRef.current;

    if (!container) return;

    const target = container.children[index] as HTMLElement | undefined;

    if (!target) return;

    target.scrollIntoView({
      behavior,
      block: "start",
    });
  };

  /* ------------------------------------------------------------------------ */
  /* Go to                                                                     */
  /* ------------------------------------------------------------------------ */

  const goToIndex = (index: number, behavior: ScrollBehavior = "smooth") => {
    if (index < 0 || index >= items.length) return;

    const target = items[index];

    setCurrentIndex(index);

    updateUrl(target);

    requestAnimationFrame(() => {
      scrollToIndex(index, behavior);
    });
  };

  const goTo = (target: GalleryItem) => {
    const index = items.findIndex((galleryItem) => galleryItem.image === target.image);

    if (index < 0) return;

    goToIndex(index);
  };

  const goPrev = () => {
    if (!hasPrev) return;

    goToIndex(currentIndex - 1);
  };

  const goNext = () => {
    if (!hasNext) return;

    goToIndex(currentIndex + 1);
  };

  const handleClose = () => {
    router.back();
  };

  /* ------------------------------------------------------------------------ */
  /* Lock body scroll — HANYA di desktop.                                     */
  /*                                                                          */
  /* Di mobile preview jadi halaman biasa yang ikut scroll bareng page,       */
  /* jadi body TIDAK boleh dikunci, supaya footer bisa dicapai.               */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!isDesktop) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isDesktop]);

  /* ------------------------------------------------------------------------ */
  /* Keyboard                                                                   */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        goPrev();
        return;
      }

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, items.length]);

  /* ------------------------------------------------------------------------ */
  /* Intersection Observer                                                     */
  /*                                                                            */
  /* Desktop: root = feed container (karena dia yang scroll, snap-mandatory). */
  /* Mobile:  root = null (viewport/window), karena yang scroll itu halaman.  */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const container = feedRef.current;

    if (!container || items.length === 0) return;

    const slides = Array.from(container.querySelectorAll<HTMLElement>("[data-slide-image]"));

    if (slides.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestEntry: IntersectionObserverEntry | null = null;

        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
            bestEntry = entry;
          }
        }

        if (!bestEntry) return;

        const image = bestEntry.target.dataset.slideImage;

        if (!image) return;

        const nextIndex = items.findIndex((galleryItem) => galleryItem.image === image);

        if (nextIndex < 0 || nextIndex === currentIndex) {
          return;
        }

        /*
         * Hanya update state.
         *
         * TIDAK ada router.replace() di sini.
         */
        setCurrentIndex(nextIndex);

        const target = items[nextIndex];

        /*
         * Update address bar saja.
         * Tidak membuat navigasi Next.js.
         */
        const url = `/gallery/preview?src=${encodeURIComponent(target.image)}`;

        window.history.replaceState(window.history.state, "", url);
      },
      {
        root: isDesktop ? container : null,
        threshold: 0.6,
      }
    );

    slides.forEach((slide) => {
      observer.observe(slide);
    });

    return () => {
      observer.disconnect();
    };
  }, [items, currentIndex, isDesktop]);

  /* ------------------------------------------------------------------------ */
  /* Initial scroll                                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!item) return;

    requestAnimationFrame(() => {
      scrollToIndex(currentIndex, "auto");
    });
  }, []);

  if (!item) {
    return null;
  }

  return (
    <div
      onContextMenu={(event) => event.preventDefault()}
      className="
        absolute z-10
        flex w-full flex-col
        bg-slate-950
         lg:inset-0 lg:z-10
        lg:h-full lg:min-h-0
        lg:flex-row
        lg:overflow-hidden
      "
    >
      {/* ------------------------------------------------------------------ */}
      {/* CLOSE — fixed ke viewport, jadi tetap kelihatan walau di-scroll     */}
      {/* ------------------------------------------------------------------ */}

      {/* <button
        type="button"
        onClick={handleClose}
        aria-label="Tutup preview"
        className="
          fixed
          right-3
          top-7
          z-50
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-black/60
          text-white
          backdrop-blur-md
          transition
          hover:bg-black/80
          active:scale-95
          sm:right-4
          sm:top-4
        "
      >
        <X size={18} />
      </button> */}

      {/* ------------------------------------------------------------------ */}
      {/* MOBILE THUMBNAILS — sticky biar tetap kejangkau saat scroll bebas   */}
      {/* ------------------------------------------------------------------ */}

        <div
            className="
            sticky
            top-11
            order-1
            z-30
            flex
            h-20
            w-full
            shrink-0
            gap-2
            overflow-x-auto
            border-b
            border-white/10
            bg-slate-950/95
            px-3
            py-2
            pr-16
            backdrop-blur-md
            lg:hidden
            "
            style={{
            scrollbarWidth: "none",
            }}
        >
            {items.map((thumb, index) => {
            const isActive = index === currentIndex;

            return (
                <button
                key={thumb.image}
                type="button"
                onClick={() => goTo(thumb)}
                aria-label={`Buka ${thumb.title}`}
                className={`
                    relative
                    h-16
                    w-20
                    shrink-0
                    overflow-hidden
                    rounded-md
                    border
                    transition
                    ${isActive ? "border-cyan-400 ring-1 ring-cyan-400/50" : "border-white/10"}
                `}
                >
                <img
                    src={getThumbnailUrl(thumb.image, 160)}
                    alt=""
                    loading={Math.abs(index - currentIndex) <= 3 ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                    className="h-full w-full object-cover"
                />
                </button>
            );
            })}
        </div>

      {/* ------------------------------------------------------------------ */}
      {/* DESKTOP SIDEBAR                                                     */}
      {/* ------------------------------------------------------------------ */}

      <aside
        className="
          order-1
          hidden
          h-full
          min-h-0
          w-60
          shrink-0
          flex-col
          gap-2
          overflow-y-auto
          border-r
          border-white/10
          bg-slate-950
          p-3
          lg:flex
          xl:w-72
        "
      >
        <p className="mb-1 shrink-0 px-1 text-xs font-medium uppercase tracking-wide text-slate-500">
          {item.category} · {items.length} foto
        </p>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
          {items.map((thumb, index) => {
            const isActive = index === currentIndex;

            return (
              <button
                key={thumb.image}
                type="button"
                onClick={() => goTo(thumb)}
                className={`
                  group
                  relative
                  block
                  w-full
                  overflow-hidden
                  rounded-lg
                  border
                  text-left
                  transition
                  ${
                    isActive
                      ? "border-cyan-400/70 ring-1 ring-cyan-400/50"
                      : "border-white/10 hover:border-white/30"
                  }
                `}
              >
                <img
                  src={getThumbnailUrl(thumb.image, 200)}
                  alt={thumb.title}
                  loading={Math.abs(index - currentIndex) <= 2 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                  className="
                    block
                    h-20
                    w-full
                    select-none
                    object-cover
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                />

                <span
                  className="
                    absolute
                    inset-x-0
                    bottom-0
                    truncate
                    bg-gradient-to-t
                    from-black/80
                    to-transparent
                    px-2
                    py-1
                    text-[11px]
                    text-white
                  "
                >
                  {thumb.title}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* FEED                                                                 */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          order-2
          relative
          w-full
          lg:flex-1
          lg:overflow-hidden
        "
      >
        {/* Previous — desktop only */}
        {hasPrev && (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Foto sebelumnya"
            className="
              absolute
              right-3
              top-1/2
              z-30
              hidden
              h-11
              w-11
              -translate-y-[calc(100%+0.5rem)]
              items-center
              justify-center
              rounded-full
              bg-black/50
              text-white
              backdrop-blur-md
              transition
              hover:bg-black/75
              active:scale-95
              lg:flex
            "
          >
            <ChevronUp size={22} />
          </button>
        )}

        {/* Next — desktop only */}
        {hasNext && (
          <button
            type="button"
            onClick={goNext}
            aria-label="Foto berikutnya"
            className="
              absolute
              right-3
              top-1/2
              z-30
              hidden
              h-11
              w-11
              translate-y-[calc(0%+0.5rem)]
              items-center
              justify-center
              rounded-full
              bg-black/50
              text-white
              backdrop-blur-md
              transition
              hover:bg-black/75
              active:scale-95
              lg:flex
            "
          >
            <ChevronDown size={22} />
          </button>
        )}

        <div
          ref={feedRef}
          className="
            flex
            w-full
            flex-col
            gap-2
            pb-16
            pt-2
            lg:h-full
            lg:snap-y
            lg:snap-mandatory
            lg:gap-0
            lg:overflow-y-auto
            lg:overscroll-contain
            lg:scroll-smooth
            lg:px-0
            lg:pb-0
            lg:pt-0
          "
          style={{
            scrollbarWidth: "none",
          }}
        >
          {items.map((slide, index) => (
            <Slide
              key={slide.image}
              slide={slide}
              isTouchDevice={isTouchDevice}
              /*
               * Hanya current + 1 sebelumnya + 1 sesudahnya
               * yang boleh load gambar.
               */
              shouldLoad={Math.abs(index - currentIndex) <= 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function GalleryPreviewPage() {
  return (
    <Suspense fallback={null}>
      <GalleryPreviewContent />
    </Suspense>
  );
}