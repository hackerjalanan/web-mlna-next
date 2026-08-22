import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { GalleryItem, SortOrder } from "@/types/gallery";

export interface GetGalleryItemsParams {
  search?: string;
  category?: string;
  sortOrder?: SortOrder;
}

/**
 * Ambil data gallery dari Supabase.
 * Gambar sendiri tetap di-hosting di Google Drive — kolom `image`
 * di tabel `gallery_items` hanya menyimpan URL-nya.
 */
export async function getGalleryItems(
  params: GetGalleryItemsParams = {}
): Promise<GalleryItem[]> {
  const { search, category, sortOrder = "newest" } = params;

  const supabase = await createClient();

  let query = supabase.from("gallery_items").select("*");

  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  if (search) {
    const keyword = search.trim();
    query = query.or(
      `title.ilike.%${keyword}%,description.ilike.%${keyword}%`
    );
  }

  query = query.order("date", { ascending: sortOrder === "oldest" });

  const { data, error } = await query;

  if (error) {
    throw new Error(`Gagal mengambil data gallery: ${error.message}`);
  }

  return (data as GalleryItem[]) ?? [];
}

/**
 * Ambil satu item gallery berdasarkan id.
 * Berguna untuk halaman detail/preview.
 */
export async function getGalleryItemById(
  id: number
): Promise<GalleryItem | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Gagal mengambil detail gallery: ${error.message}`);
  }

  return (data as GalleryItem) ?? null;
}