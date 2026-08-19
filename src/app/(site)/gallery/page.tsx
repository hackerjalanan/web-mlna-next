"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { galleryItems, type GalleryCategory, type GalleryItem } from "@/data/gallery";
import type { SortOrder } from "./types";

import GalleryFilterBar from "./components/GalleryFilterBar";
import GalleryGrid from "./components/GalleryGrid";

export default function Gallery() {   
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"All" | GalleryCategory>("All");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const openImage = (item: GalleryItem) => {
    router.push(`/gallery/preview?src=${encodeURIComponent(item.image)}`);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
  };

  const filteredGallery = useMemo(() => {
    const keyword = search.toLowerCase();

    return galleryItems
      .filter((item) => {
        const matchSearch =
          item.title.toLowerCase().includes(keyword) ||
          item.description.toLowerCase().includes(keyword);

        const matchCategory = category === "All" || item.category === category;

        return matchSearch && matchCategory;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [search, category, sortOrder]);

  return (
    <section className="min-h-screen">
      <div className="mx-auto px-4 max-w-[1440px] md:px-4">
        <div className="mb-8">
          <p className="mb-2 text-sm text-cyan-400">MY COLLECTION</p>
          <h1 className="text-3xl font-bold text-white md:text-4xl">Gallery</h1>
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            Kumpulan foto, desain, project, dan aktivitas yang pernah saya
            kerjakan.
          </p>
        </div>

        <GalleryFilterBar
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          resultCount={filteredGallery.length}
          onReset={resetFilters}
        />

        <GalleryGrid items={filteredGallery} onSelect={openImage} />
      </div>
    </section>
  );
}