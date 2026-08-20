"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronUp, ChevronDown } from "lucide-react";

import { galleryItems, type GalleryItem } from "@/data/gallery";
import { getThumbnailUrl } from "@/lib/GetThumbnailUrl";
import { Slide } from "./Slide";

/* -------------------------------------------------------------------------- */
/* Touch device                                                               */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* Desktop viewport (disamakan dengan breakpoint `lg` Tailwind = 1024px)      */
/*                                                                            */
/* Dipakai untuk memutuskan: apakah preview jadi overlay fullscreen (desktop) */
/* atau halaman biasa yang scroll bebas (mobile).                            */
/* -------------------------------------------------------------------------- */

import { useIsTouchDevice, useIsDesktopViewport } from "./hooks";

/* -------------------------------------------------------------------------- */
/* Gallery Preview                                                            */
/* -------------------------------------------------------------------------- */

const DESKTOP_LOAD_RADIUS = 2; // desktop: current ± 2 = 5 slide render sekaligus

const MOBILE_BATCH_SIZE = 5; // mobile: tiap kali nambah window, +5 slide
const MOBILE_EDGE_THRESHOLD = 1; // mulai nambah batch kalau currentIndex sudah sedekat ini dari ujung window

function GalleryPreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const src = searchParams.get("src");

  const isTouchDevice = useIsTouchDevice();
  const isDesktop = useIsDesktopViewport();

  const feedRef = useRef<HTMLDivElement | null>(null);

  /*
   * Index slide yang SEDANG jadi target scroll (misal habis klik thumbnail
   * di sidebar desktop, ATAU initial open dari grid). Dipakai untuk
   * mengoreksi ulang posisi scroll begitu gambar target selesai load
   * (lihat onImageSettled di Slide) — karena di mobile tinggi slide
   * berubah dari 0px -> tinggi asli setelah gambar selesai load.
   */
  const pendingScrollIndexRef = useRef<number | null>(null);

  /*
   * Cari item awal berdasarkan URL.
   */
  const initialItem =
    galleryItems.find((galleryItem) => galleryItem.image === src) ?? null;

  /*
   * Semua foto dari kategori yang sama.
   *
   * di-useMemo supaya reference-nya stabil antar render (hanya berubah
   * kalau initialItem/src benar-benar berubah) — dipakai sebagai dependency
   * effect sync-scroll di bawah, jadi effect itu tidak re-run tiap render.
   */
  const items = useMemo(
    () =>
      initialItem
        ? galleryItems.filter(
            (galleryItem) => galleryItem.category === initialItem.category
          )
        : [],
    [initialItem]
  );

  const initialIndex = initialItem
    ? Math.max(
        0,
        items.findIndex((galleryItem) => galleryItem.image === initialItem.image)
      )
    : 0;

  /*
   * Window slide yang boleh render <img> di mobile.
   *
   * PENTING: window ini HANYA BOLEH MELEBAR, tidak pernah menyusut.
   * Begitu currentIndex mendekati ujung window, ujung itu ditambah
   * +MOBILE_BATCH_SIZE — ujung yang lain (yang sudah dilewati) TIDAK
   * disentuh, jadi slide yang sudah pernah dimuat tidak akan pernah
   * di-unmount / perlu dimuat ulang saat scroll lanjut ke arah yang sama.
   *
   * Di-init langsung center di sekitar initialIndex (gambar yang diklik
   * dari grid), bukan dari 0 — supaya sejak render pertama window sudah
   * pas, tidak perlu nunggu 1 render tambahan lewat effect recenter.
   */
  const [loadedRange, setLoadedRange] = useState(() => {
    const half = Math.floor(MOBILE_BATCH_SIZE / 2);

    return {
      start: Math.max(0, initialIndex - half),
      end: Math.min(
        Math.max(items.length - 1, 0),
        initialIndex + half
      ),
    };
  });

  /*
   * Index aktif disimpan secara lokal.
   *
   * Jadi scroll tidak perlu mengubah searchParams
   * menggunakan router.replace().
   */
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  /*
   * Ref: index terakhir yang posisi scroll-nya sudah "dikonfirmasi" sesuai
   * dengan `src` saat ini. `null` di awal supaya scroll pertama (initial
   * mount / initial paint) tetap dijalankan.
   *
   * PENTING: effect di bawah ini menangani DUA kasus sekaligus —
   * (1) initial open (misal dari grid, lewat URL ?src=...), dan
   * (2) navigasi URL berikutnya yang datang dari LUAR komponen ini
   *     (misal user klik gambar lain di grid di belakang overlay,
   *     yang tidak lewat sidebar/goToIndex).
   *
   * Navigasi lewat sidebar/keyboard (goToIndex) TIDAK memicu effect ini,
   * karena goToIndex mengubah URL lewat `window.history.replaceState`
   * (bukan navigasi Next.js), jadi `useSearchParams()` / `src` di sini
   * tidak berubah — goToIndex sudah scroll sendiri secara eksplisit.
   *
   * Sebelumnya, effect ini HANYA memanggil setCurrentIndex tanpa pernah
   * memanggil scrollToIndex untuk kasus (2) — akibatnya index di state
   * sudah benar, tapi posisi scroll di layar tetap di gambar lama. Ini
   * yang bikin klik gambar X dari grid (satu-satunya cara navigasi di
   * mobile, karena tidak ada sidebar) terlihat seperti "tetap nampilin
   * gambar A".
   */
  const syncedIndexRef = useRef<number | null>(null);

  useEffect(() => {
    if (!src) return;

    const index = items.findIndex((galleryItem) => galleryItem.image === src);

    if (index < 0) return;

    if (syncedIndexRef.current === index) return;

    const isFirstScroll = syncedIndexRef.current === null;

    syncedIndexRef.current = index;

    pendingScrollIndexRef.current = index;

    setCurrentIndex(index);

    requestAnimationFrame(() => {
      scrollToIndex(index, isFirstScroll ? "auto" : "smooth");
    });
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

    /*
     * Tandai slide ini sebagai target scroll yang masih "pending".
     * Kalau gambarnya belum ter-load saat scrollIntoView dipanggil
     * (tinggi masih 0px), koreksi akan dilakukan lagi lewat
     * onImageSettled begitu gambar benar-benar selesai load.
     */
    pendingScrollIndexRef.current = index;

    /*
     * Tandai juga di syncedIndexRef, supaya kalau suatu saat `src` ini
     * benar-benar ter-sync lewat navigasi Next.js (bukan hanya
     * replaceState), effect sync-scroll tidak scroll ulang secara
     * tidak perlu ke posisi yang sudah benar.
     */
    syncedIndexRef.current = index;

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
  /* jadi body TIDAK boleh dikunci, supaya footer bisa dicapai. Tidak ada     */
  /* scroll-snap & tidak ada thumbnail bar di mobile — scroll bebas apa       */
  /* adanya seperti halaman biasa.                                           */
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
  /* Growing load-window untuk mobile.                                        */
  /*                                                                          */
  /* Window hanya melebar (+MOBILE_BATCH_SIZE) saat currentIndex mendekati    */
  /* salah satu ujungnya. Ujung yang lain TIDAK disentuh — jadi slide yang    */
  /* sudah dilewati tetap ter-mount, tidak perlu dimuat ulang.                */
  /*                                                                          */
  /* Kalau currentIndex melompat jauh di luar window (misal buka link foto    */
  /* lain via URL / ganti src), window baru di-recenter di sekitar posisi    */
  /* itu. (Recenter untuk initial index sudah ditangani lewat lazy init      */
  /* state di atas, effect ini hanya menangani perpindahan setelahnya.)      */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (isDesktop) return;
    if (items.length === 0) return;

    setLoadedRange((prev) => {
      if (currentIndex < prev.start || currentIndex > prev.end) {
        const half = Math.floor(MOBILE_BATCH_SIZE / 2);

        return {
          start: Math.max(0, currentIndex - half),
          end: Math.min(items.length - 1, currentIndex + half),
        };
      }

      let { start, end } = prev;

      if (currentIndex + MOBILE_EDGE_THRESHOLD >= end && end < items.length - 1) {
        end = Math.min(items.length - 1, end + MOBILE_BATCH_SIZE);
      }

      if (currentIndex - MOBILE_EDGE_THRESHOLD <= start && start > 0) {
        start = Math.max(0, start - MOBILE_BATCH_SIZE);
      }

      if (start === prev.start && end === prev.end) return prev;

      return { start, end };
    });
  }, [currentIndex, items.length, isDesktop]);

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

        const image = (bestEntry.target as HTMLElement).dataset.slideImage;

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

  if (!item) {
    return null;
  }

  return (
    <div
      onContextMenu={(event) => event.preventDefault()}
      className="
        relative z-10
        flex w-full flex-col
        bg-slate-950
        lg:absolute lg:inset-0 lg:z-10
        lg:h-full lg:min-h-0
        lg:flex-row
        lg:overflow-hidden
      "
    >
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
              isDesktop={isDesktop}
              shouldLoad={
                isDesktop
                  ? Math.abs(index - currentIndex) <= DESKTOP_LOAD_RADIUS
                  : index >= loadedRange.start && index <= loadedRange.end
              }
              onImageSettled={() => {
                if (pendingScrollIndexRef.current !== index) return;

                pendingScrollIndexRef.current = null;

                scrollToIndex(index, "auto");
              }}
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