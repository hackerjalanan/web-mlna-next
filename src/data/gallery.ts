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
    title: "Mountain View",
    description: "Landscape photography",
    image:
      "https://lh3.googleusercontent.com/d/11CihdaZPcPKADD0Rx9TgCd6VXJqk1gGw",
    category: "Photography",
    date: "2026-08-10",
  },
  {
    id: 2,
    title: "Portfolio Design",
    description: "Website portfolio design",
    image:"https://lh3.googleusercontent.com/d/1QHLYcOlz6TQKGBP70Rm9-w9vzKy36Usp",
    category: "Design",
    date: "2026-08-05",
  },
  {
    id: 3,
    title: "Web Project",
    description: "Fullstack web application",
    image:"https://lh3.googleusercontent.com/d/1QHLYcOlz6TQKGBP70Rm9-w9vzKy36Usp",
    category: "Project",
    date: "2026-07-20",
  },
  {
    id: 4,
    title: "Coding Activity",
    description: "Development activity",
    image:"https://lh3.googleusercontent.com/d/1QHLYcOlz6TQKGBP70Rm9-w9vzKy36Usp",
    category: "Activity",
    date: "2026-07-10",
  },
];