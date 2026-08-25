export interface Project {
  title: string;
  slug: string;
  category: string;
  year: string;
  description: string;
  technologies: string[];
  image?: string;
  link?: string;
  github?: string;
  demo?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    title: "Training Report",
    slug: "training-report",
    category: "Web App",
    year: "2026",
    description:
      "Sistem untuk monitoring dan pelaporan training.",
    technologies: ["React.js", "Node.js", "MySQL"],
    image: "/projects/training-report.jpg",
    github: "https://github.com/ademlna/training-report-gii.git",
    demo: "https://fe-trainer-ade-legends-projects.vercel.app/",
    featured: true,
  },

  {
    title: "Personal Portfolio",
    slug: "personal-portfolio",
    category: "Web Development",
    year: "2026",
    description:
      "Portfolio personal dengan Next.js dan Tailwind CSS untuk menampilkan profile dan project.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    image: "/projects/personal-portfolio.jpg",
    github: "https://github.com/ademlna/personal-portofolio.git",
    demo: "https://ade-maulana.my.id/",
  },

  {
    title: "Mobile Authentication App",
    slug: "mobile-authentication-app",
    category: "Mobile App",
    year: "2026",
    description:
      "Aplikasi autentikasi mobile dengan React Native dan Firebase.",
    technologies: ["Dart", "Flutter", "MySQL"],
    image: "/projects/mobile-authentication-app.jpg",
    github: "https://github.com/ademlna/Mobile-Authentication-App",
    demo: "https://ade-maulana.my.id/",
  },

  {
    title: "BE Authentication App",
    slug: "be-authentication-app",
    category: "Backend",
    year: "2026",
    description:
      "Aplikasi autentikasi mobile dengan React Native dan Firebase.",
    technologies: ["PHP", "Laravel", "MySQL"],
    image: "/projects/be-authentication-app.jpg",
    github: "https://github.com/ademlna/Mobile-Authentication-App",
    demo: "https://ade-maulana.my.id/",
  },

  {
    title: "Babinsa Messenger",
    slug: "babinsa-messenger",
    category: "Backend Web App",
    year: "2024-2025",
    description:
      "Aplikasi komunikasi berbasis web dengan REST API untuk kebutuhan komunikasi.",
    technologies: ["Node.js", "Express.js", "MySQL"],
    image: "/projects/babinsa-messenger.jpg",
    github: "#",
    demo: "#",
  },
];