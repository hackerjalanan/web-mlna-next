"use client";

import { useRouter } from "next/navigation";
import { useGallery } from "@/hook/use_gallery.hook";
import type { GalleryItem } from "@/types/gallery";
import Link from "next/link";
import { Upload } from "lucide-react";

import GalleryFilterBar from "../../components/GalleryFilterBar";
import GalleryGrid from "../../components/GalleryGrid";

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

  const openImage = (item: GalleryItem) => {
    const makeSlideId = (image: string) =>
      "slide-" + image.replace(/[^a-z0-9-_]/gi, "-");

    const id = makeSlideId(item.image);

    router.push(`/gallery/preview?src=${encodeURIComponent(item.image)}#${id}`);
  };

  return (
    <div>

      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm text-cyan-400">MY COLLECTION</p>
          <h1 className="text-3xl font-bold text-white md:text-4xl">Gallery</h1>
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            Kumpulan foto, desain, project, dan aktivitas yang pernah saya
            kerjakan.
          </p>
        </div>
        <Link
          href="/admin/gallery/create"
          className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 text-sm font-semibold text-slate-950 transition hover:brightness-110"
        >
          <Upload size={16} />
          <span className="hidden sm:inline">Upload</span>
        </Link>
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

      {!loading && !error && (
        <GalleryGrid items={items} onSelect={openImage} />
      )}
    </div>
  );
}