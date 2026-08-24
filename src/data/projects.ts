export interface Project {
  title: string;
  slug: string;
  category: string;
  year: string;
  description: string;
  technologies: string[];
  image?: string;
  link?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    title: "Training Dashboard",
    slug: "training-dashboard",
    category: "Web App",
    year: "2024",
    description:
      "Dashboard untuk monitoring dan pelaporan training secara real-time.",
    technologies: ["React.js", "Node.js", "MySQL"],
    image: "/projects/training-dashboard.jpg",
    featured: true,
  },

  {
    title: "Babinsa Messenger",
    slug: "babinsa-messenger",
    category: "Web App",
    year: "2024",
    description:
      "Aplikasi komunikasi berbasis web dengan REST API untuk kebutuhan komunikasi.",
    technologies: ["Node.js", "Express.js", "MySQL"],
    image: "/projects/babinsa-messenger.jpg",
  },

  {
    title: "Personal Portfolio",
    slug: "personal-portfolio",
    category: "Web Development",
    year: "2024",
    description:
      "Portfolio personal dengan Next.js dan Tailwind CSS untuk menampilkan profile dan project.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    image: "/projects/personal-portfolio.jpg",
  },
];