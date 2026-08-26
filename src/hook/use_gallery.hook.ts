"use client";

import { useEffect, useState } from "react";
import { fetchGalleryItems } from "@/service/gallery-client.service";
import type { GalleryCategory, GalleryItem, SortOrder } from "@/types/gallery";

export function useGallery() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"All" | GalleryCategory>("All");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    // Debounce ringan supaya tidak fetch di setiap ketikan.
    const timeout = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchGalleryItems({ search, category, sortOrder });
        if (active) setItems(data);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Terjadi kesalahan");
          setItems([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [search, category, sortOrder]);

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
  };

  const isFiltered = search !== "" || category !== "All";

  return {
    // state
    search,
    category,
    sortOrder,
    items,
    loading,
    error,
    isFiltered,
    // actions
    setSearch,
    setCategory,
    setSortOrder,
    resetFilters,
  };
}