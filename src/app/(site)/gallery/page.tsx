"use client";

import { useRouter } from "next/navigation";
import { useGallery } from "@/hook/use_gallery.hook";
import type { GalleryItem } from "@/types/gallery";
import GalleryFilterBar from "./components/GalleryFilterBar";
import GalleryGrid from "./components/GalleryGrid";

export default function Gallery() {
  const router = useRouter();
  const {
    search,
    category,
    sortOrder,
    items,
    loading,
    error,
    isFiltered,
    setSearch,
    setCategory,
    setSortOrder,
    resetFilters,
  } = useGallery();

  const openPreview = (item: GalleryItem) => {
    sessionStorage.setItem("gallery-preview-items", JSON.stringify(items));

    const params = new URLSearchParams({
      id: String(item.id),
    });

    router.push(`/gallery/preview?${params.toString()}`);
  };

  return (
    <div className="mb-0 p-3">
      <div className="mb-0">
        <p className="mb-2 text-sm text-cyan-400">MY COLLECTION</p>
        <h1 className="text-3xl font-bold text-white md:text-4xl">Gallery</h1>
        <p className="mt-2 max-w-xl text-sm text-slate-400">
          Kumpulan foto, desain, dan aktivitas.
        </p>
      </div>

      <GalleryFilterBar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        isFiltered={isFiltered}
        onReset={resetFilters}
        resultCount={items.length}
      />

      {loading && (
        <div className="flex h-40 items-center justify-center">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />
        </div>
      )}

      {!loading && error && (
        <div className="text-sm text-red-400">Gagal memuat gallery: {error}</div>
      )}

      {!loading && !error && <GalleryGrid items={items} onSelect={openPreview} />}
    </div>
  );
}