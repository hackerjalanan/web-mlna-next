import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { GalleryCategory, GalleryItem, SortOrder } from "@/types/gallery";

export interface GetGalleryItemsParams {
  search?: string;
  category?: GalleryCategory;
  sortOrder?: SortOrder;
}

export async function getGalleryItems(
  params: GetGalleryItemsParams = {}
): Promise<GalleryItem[]> {
  const { search, category, sortOrder = "newest" } = params;

  const supabase = await createClient();

  let query = supabase.from("gallery_items").select("*");

  if (category) {
    query = query.eq("category", category);
  }

  if (search) {
    const keyword = search.trim().replace(/[%,]/g, "");
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
    throw new Error(`Gagal mengambil data gallery: ${error.message}`);
  }

  return (data as GalleryItem) ?? null;
}