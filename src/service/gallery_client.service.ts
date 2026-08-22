import type { GalleryItem, SortOrder } from "@/types/gallery";

export interface FetchGalleryItemsParams {
  search?: string;
  category?: string;
  sortOrder?: SortOrder;
}

/**
 * Dipanggil dari client component ("use client") untuk mengambil
 * data gallery lewat API route /api/gallery.
 */
export async function fetchGalleryItems(
  params: FetchGalleryItemsParams = {}
): Promise<GalleryItem[]> {
  const query = new URLSearchParams();

  if (params.search) query.set("search", params.search);
  if (params.category && params.category !== "All") {
    query.set("category", params.category);
  }
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);

  const response = await fetch(`/api/gallery?${query.toString()}`, {
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error ?? "Gagal memuat gallery");
  }

  return result.data as GalleryItem[];
}