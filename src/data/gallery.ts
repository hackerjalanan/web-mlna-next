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
    image: "/images/gallery/mountain.jpg",
    category: "Photography",
    date: "2026-08-10",
  },
  {
    id: 2,
    title: "Portfolio Design",
    description: "Website portfolio design",
    image: "/images/gallery/portfolio.jpg",
    category: "Design",
    date: "2026-08-05",
  },
  {
    id: 3,
    title: "Web Project",
    description: "Fullstack web application",
    image: "/images/gallery/project.jpg",
    category: "Project",
    date: "2026-07-20",
  },
  {
    id: 4,
    title: "Coding Activity",
    description: "Development activity",
    image: "/images/gallery/coding.jpg",
    category: "Activity",
    date: "2026-07-10",
  },
];