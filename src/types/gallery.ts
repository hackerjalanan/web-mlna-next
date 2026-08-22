export type GalleryCategory =
  | "Photography"
  | "Design"
  | "Project"
  | "Activity";

export type SortOrder = "newest" | "oldest";

export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: GalleryCategory;
  date: string;
  created_at?: string;
}




