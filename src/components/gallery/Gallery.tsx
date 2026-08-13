"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Search,
  SlidersHorizontal,
  X,
  CalendarDays,
} from "lucide-react";

import {
  galleryItems,
  type GalleryCategory,
} from "@/data/gallery";

type SortOrder = "newest" | "oldest";

const categories: ("All" | GalleryCategory)[] = [
  "All",
  "Photography",
  "Design",
  "Project",
  "Activity",
];

export default function Gallery() {
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState<"All" | GalleryCategory>("All");

  const [sortOrder, setSortOrder] =
    useState<SortOrder>("newest");

  const [selectedImage, setSelectedImage] =
    useState<(typeof galleryItems)[number] | null>(null);

  const filteredGallery = useMemo(() => {
    return galleryItems
      .filter((item) => {
        const keyword = search.toLowerCase();

        const matchSearch =
          item.title.toLowerCase().includes(keyword) ||
          item.description.toLowerCase().includes(keyword);

        const matchCategory =
          category === "All" ||
          item.category === category;

        return matchSearch && matchCategory;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        return sortOrder === "newest"
          ? dateB - dateA
          : dateA - dateB;
      });
  }, [search, category, sortOrder]);

  return (
    <section className="min-h-screen px-2  md:px-4">
      
      {/* Header */}
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="mb-2 text-sm text-cyan-400">
            MY COLLECTION
          </p>

          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Gallery
          </h1>

          <p className="mt-2 max-w-xl text-sm text-slate-400">
            Kumpulan foto, desain, project, dan aktivitas
            yang pernah saya kerjakan.
          </p>
        </div>

        {/* Filter */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
          
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Search */}
            <div className="relative w-full lg:max-w-sm">
              <Search
                size={18}
                className="
                  absolute left-3 top-1/2
                  -translate-y-1/2
                  text-slate-500
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Cari foto..."
                className="
                  w-full rounded-xl
                  border border-white/10
                  bg-slate-950/70
                  py-2.5 pl-10 pr-4
                  text-sm text-white
                  outline-none
                  placeholder:text-slate-500
                  focus:border-cyan-400/50
                "
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <CalendarDays
                size={17}
                className="text-slate-500"
              />

              <select
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(
                    e.target.value as SortOrder
                  )
                }
                className="
                  rounded-xl
                  border border-white/10
                  bg-slate-950/70
                  px-3 py-2.5
                  text-sm text-white
                  outline-none
                "
              >
                <option value="newest">
                  Terbaru
                </option>

                <option value="oldest">
                  Terlama
                </option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  setCategory(item)
                }
                className={`
                  whitespace-nowrap rounded-full
                  px-4 py-2 text-xs font-medium
                  transition-all
                  ${
                    category === item
                      ? "bg-cyan-400 text-slate-950"
                      : "border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            {filteredGallery.length} foto
          </span>

          {(search || category !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="
                flex items-center gap-1
                text-xs text-slate-400
                hover:text-white
              "
            >
              <X size={14} />
              Reset
            </button>
          )}
        </div>

        {/* Gallery Grid */}
        {filteredGallery.length > 0 ? (
          <div className="
            grid
            grid-cols-2
            gap-3
            sm:grid-cols-3
            md:grid-cols-4
          ">
            {filteredGallery.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setSelectedImage(item)
                }
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
                    sizes="
                      (max-width: 640px) 50vw,
                      (max-width: 1024px) 33vw,
                      25vw
                    "
                    className="
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-110
                    "
                  />

                  {/* Overlay */}
                  <div className="
                    absolute inset-0
                    bg-gradient-to-t
                    from-black/80
                    via-transparent
                    to-transparent
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                  " />

                  <div className="
                    absolute bottom-0 left-0 right-0
                    translate-y-2
                    p-3
                    opacity-0
                    transition-all
                    duration-300
                    group-hover:translate-y-0
                    group-hover:opacity-100
                  ">
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
        ) : (
          <div className="
            flex min-h-60
            items-center justify-center
            rounded-2xl
            border border-dashed
            border-white/10
            text-sm text-slate-500
          ">
            Tidak ada foto yang ditemukan.
          </div>
        )}
      </div>

      {/* Preview */}
      {selectedImage && (
        <div
          className="
            fixed inset-0 z-[99999]
            flex items-center justify-center
            bg-black/80 p-4
            backdrop-blur-sm
          "
          onClick={() =>
            setSelectedImage(null)
          }
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
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              type="button"
              onClick={() =>
                setSelectedImage(null)
              }
              className="
                absolute right-3 top-3 z-10
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

            <div className="relative h-[70vh] w-[90vw] max-w-5xl">
              <Image
                src={selectedImage.image}
                alt={selectedImage.title}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>

            <div className="border-t border-white/10 p-4">
              <h2 className="text-sm font-semibold text-white">
                {selectedImage.title}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {selectedImage.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}