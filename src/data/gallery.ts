export type GalleryCategory =
  | "Photography"
  | "Design"
  | "Project"
  | "Activity";

export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: GalleryCategory;
  date: string;
}
export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Rawapening",
    description: "Landscape photography",
    image:"https://lh3.googleusercontent.com/d/11CihdaZPcPKADD0Rx9TgCd6VXJqk1gGw",
    category: "Photography",
    date: "2026-08-10",
  },

];
