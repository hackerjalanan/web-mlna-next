"use client";

import { useRef, useState } from "react";
import {
  TransformWrapper,
  TransformComponent,
  type ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";

import type { GalleryItem } from "@/data/gallery";

/* -------------------------------------------------------------------------- */
/* Slide                                                                      */
/* -------------------------------------------------------------------------- */

interface SlideProps {
  slide: GalleryItem;
  isTouchDevice: boolean;
  shouldLoad: boolean;
}

/*
 * Mobile: card full width seperti feed IG.
 * - w-full, TANPA px/rounded → gambar full-bleed selebar layar.
 * - Tinggi TIDAK dipaksa (tidak ada h-[..vh] lagi), mengikuti tinggi
 *   natural gambar (lewat img h-auto), jadi rasio gambar apa adanya.
 *
 * Desktop (lg): tetap h-full penuh + snap, sesuai perilaku semula.
 */
const slideWrapperClass = `
  relative
  flex w-full shrink-0
  items-center justify-center
  overflow-hidden
  lg:h-full lg:w-full
  lg:snap-start lg:snap-always
`;

export function Slide({ slide, isTouchDevice, shouldLoad }: SlideProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const transformRef = useRef<ReactZoomPanPinchRef>(null);

  /*
   * Kalau slide belum dekat dengan slide aktif,
   * jangan render gambar sama sekali.
   */
  if (!shouldLoad) {
    return <div data-slide-image={slide.image} className={slideWrapperClass} />;
  }

  const handleImageClick = () => {
    const instance = transformRef.current;

    if (!instance) return;

    if (isZoomed) {
      instance.resetTransform(200, "easeOut");
    } else {
      instance.zoomIn(0.6, 200, "easeOut");
    }
  };

  return (
    <div data-slide-image={slide.image} className={slideWrapperClass}>
      {/* Loading indicator — pakai min-height sementara supaya spinner
          tidak "collapse" sebelum gambar punya tinggi natural */}
      {!isLoaded && !hasError && (
        <div
          className="
            absolute 
            inset-0
            z-10
            flex
            min-h-[45vh]
            items-center
            justify-center
            lg:min-h-0
          "
        >
          <div
            className="
              h-8 w-8
              animate-spin
              rounded-full
              border-2
              border-white/10
              border-t-cyan-400
            "
          />
        </div>
      )}

      {/* Error */}
      {hasError && (
        <div className="flex min-h-[45vh] w-full items-center justify-center px-6 text-center lg:min-h-0">
          <p className="text-xs text-slate-400">Gambar gagal dimuat.</p>
        </div>
      )}

      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={1}
        maxScale={5}
        centerOnInit
        centerZoomedOut
        wheel={{
          disabled: true,
        }}
        pinch={{
          step: 5,
          disabled: false,
        }}
        panning={{
          /*
           * Mobile:
           * - belum zoom → swipe digunakan feed
           * - sudah zoom → gambar boleh dipan
           */
          disabled: isTouchDevice && !isZoomed,
          velocityDisabled: false,
        }}
        doubleClick={{
          disabled: true,
        }}
        zoomAnimation={{
          animationTime: 200,
          animationType: "easeOut",
        }}
        onTransformed={(_ref, state) => {
          setIsZoomed(state.scale > 1.01);
        }}
      >
        <TransformComponent
          wrapperClass="!w-full !h-auto lg:!h-full lg:!w-full"
          contentClass="!w-full !h-auto flex items-center justify-center lg:!h-full lg:!w-full"
        >
          <img
            src={slide.image}
            alt={slide.title}
            draggable={false}
            referrerPolicy="no-referrer"
            decoding="async"
            onClick={handleImageClick}
            onLoad={() => {
              setIsLoaded(true);

              requestAnimationFrame(() => {
                transformRef.current?.centerView(1, 0);
              });
            }}
            onError={() => {
              setHasError(true);
            }}
            className={`
              block z-10
              w-full
              h-auto
              select-none
              object-contain
              transition-opacity
              duration-300
              lg:h-auto
              lg:max-h-[90%]
              lg:w-auto
              lg:max-w-[88%]
              ${isLoaded ? "opacity-100" : "opacity-0"}
              ${isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}
            `}
          />
        </TransformComponent>
      </TransformWrapper>

      {/* Caption */}
      {isLoaded && !hasError && (
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            z-20
            bg-gradient-to-t
            from-black/90
            via-black/50
            to-transparent
            px-4
            pb-5
            pt-12
            sm:px-6
            sm:pb-7
          "
        >
          <h2 className="line-clamp-2 text-sm font-semibold text-white sm:text-base">
            {slide.title}
          </h2>

          <p className="mt-1 line-clamp-2 max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">
            {slide.description}
          </p>
        </div>
      )}
    </div>
  );
}