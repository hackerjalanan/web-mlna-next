import type { GalleryItem, SortOrder } from "@/types/gallery";

export interface FetchGalleryItemsParams {
  search?: string;
  category?: string;
  sortOrder?: SortOrder;
}

interface GalleryApiResponse {
  success: boolean;
  message: string;
  data: GalleryItem[];
}

export async function fetchGalleryItems( params: FetchGalleryItemsParams = {}): Promise<GalleryItem[]> {
  const query = new URLSearchParams();

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.category && params.category !== "All") {
    query.set("category", params.category);
  }

  if (params.sortOrder) {
    query.set("sortOrder", params.sortOrder);
  }

  const queryString = query.toString();

  const response = await fetch(
    `/api/v1/gallery${queryString ? `?${queryString}` : ""}`,
    {
      cache: "no-store",
    }
  );

  const result: GalleryApiResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal memuat gallery"
    );
  }

  return result.data;
}


export async function fetchGalleryItem( id: number ): Promise<GalleryItem> {
  const response = await fetch(`/api/v1/gallery/${id}`, {
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ??
      result.error ??
      "Gagal memuat gallery"
    );
  }

  return result.data as GalleryItem;
}


