"use client";

import {
  TransformWrapper,
  TransformComponent,
} from "react-zoom-pan-pinch";
import { X } from "lucide-react";
import type { GalleryItem } from "@/data/gallery";

interface GalleryImagePreviewProps {
  item: GalleryItem;
  isLoading: boolean;
  onClose: () => void;
}

export default function GalleryImagePreview({
  item,
  isLoading,
  onClose,
}: GalleryImagePreviewProps) {
  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="
        fixed inset-0 z-[99999]
        flex items-center justify-center
        bg-black/80 p-4
        backdrop-blur-sm
      "
      onClick={onClose}
    >
      <div
        className="
          relative
          max-h-[90vh]
          max-w-5xl
          overflow-hidden
          rounded-2xl
          border border-white/10
          bg-slate-950
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="
            absolute right-3 top-3 z-30
            flex h-9 w-9
            items-center justify-center
            rounded-full
            bg-black/60
            text-white
            backdrop-blur
            hover:bg-black/80
          "
        >
          <X size={18} />
        </button>

        {/* IMAGE AREA */}
        <div className="relative flex min-h-[300px] min-w-[300px] items-center justify-center">
          {isLoading && (
            <div className="flex h-[300px] w-[300px] flex-col items-center justify-center">
              <div
                className="
                  h-10 w-10
                  animate-spin
                  rounded-full
                  border-2
                  border-slate-700
                  border-t-cyan-400
                "
              />

              <p className="mt-4 text-xs text-slate-400">
                Menyiapkan gambar...
              </p>
            </div>
          )}

          {!isLoading && (
            <TransformWrapper
              initialScale={1}
              minScale={1}
              maxScale={4}
              wheel={{ step: 0.1 }}
              pinch={{ step: 5 }}
              doubleClick={{ mode: "reset" }}
              centerOnInit
            >
              <TransformComponent
                wrapperClass="!max-h-[80vh] !max-w-[90vw]"
                contentClass="!max-h-[80vh] !max-w-[90vw]"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  draggable={false}
                  className="
                    block
                    max-h-[80vh]
                    max-w-[90vw]
                    h-auto
                    w-auto
                    select-none
                    object-contain
                  "
                />
              </TransformComponent>
            </TransformWrapper>
          )}
        </div>

        {/* INFORMATION */}
        {!isLoading && (
          <div className="border-t border-white/10 p-4">
            <h2 className="text-sm font-semibold text-white">
              {item.title}
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              {item.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}