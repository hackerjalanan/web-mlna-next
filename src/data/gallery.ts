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
  {
    id: 2,
    title: "Rawapening",
    description: "Landscape photography",
    image:"https://lh3.googleusercontent.com/d/11baHJntKN7w11Q61g1KxJ1dHBMyLG7dm",
    category: "Photography",
    date: "2026-08-05",
  },
  {
    id: 3,
    title: "Rawapening",
    description: "Landscape photography",
    image:"https://lh3.googleusercontent.com/d/1LKEeItREYqIFQvMrlbcddXmHjfyplxZk",
    category: "Photography",
    date: "2026-07-20",
  },
  { 
    id: 4,
    title: "Telomoyo",
    description: "Landscape photography",
    image:"https://lh3.googleusercontent.com/d/17dw5MRhmImGhUmybRrm1ZzY3QhgaBQe0",
    category: "Photography",
    date: "2026-07-10",
  },
  { 
    id: 5,
    title: "Telomoyo",
    description: "Landscape photography",
    image:"https://lh3.googleusercontent.com/d/1wEh7t9-G2U-04EiQXFENW9I7px09YkiF",
    category: "Photography",
    date: "2026-07-10",
  },
  { 
    id: 6,
    title: "Telomoyo",
    description: "Landscape photography",
    image:"https://lh3.googleusercontent.com/d/1ZUE5vTlaiWu5gF-8kuKpoimUNTB-uBJR",
    category: "Photography",
    date: "2026-07-10",
  },
];