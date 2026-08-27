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
      "Sistem untuk monitoring dan pelaporan training dengan notification by email.",
    technologies: ["React.js", "Node.js", "MySQL"],
    image: "/projects/training-report.jpg",
    github: "https://github.com/ademlna/training-report-gii.git",
    demo: "https://fe-trainer-ade-legends-projects.vercel.app/",
    featured: true,
  },

  {
    title: "Personal Portfolio",
    slug: "personal-portfolio",
    category: "Web App",
    year: "2026",
    description:
      "Portfolio personal dengan Next.js dan Tailwind CSS untuk menampilkan profile dan project.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS","PostgreSQL"],
    image: "/projects/personal-portfolio.jpg",
    github: "https://github.com/ademlna/personal-portofolio.git",
    demo: "https://ade-maulana.my.id/",
  },

  {
    title: "Mobile Authentication App",
    slug: "Web App",
    category: "Mobile App",
    year: "2026",
    description:
      "Aplikasi autentikasi mobile berbasis Flutter dengan alur login, registrasi, dan manajemen sesi yang aman.",
    technologies: ["Dart", "Flutter"],
    image: "/projects/mobile-authentication-app.jpg",
    github: "https://github.com/ademlna/Mobile-Authentication-App",
    demo: "https://ade-maulana.my.id/",
  },

  {
    title: "BE Authentication App",
    slug: "be-authentication-app",
    category: "Web App",
    year: "2026",
    description:
        "Backend authentication service berbasis Laravel dengan alur login, registrasi, dan verifikasi OTP. Menggunakan Redis untuk manajemen sesi/cache dan MySQL sebagai penyimpanan data pengguna, dirancang aman dan siap diintegrasikan dengan aplikasi frontend/mobile.",
    technologies: ["Mysql", "Laravel", "Redis","OTP"],
    image: "/projects/be-authentication-app.jpg",
    github: "https://github.com/ademlna/Mobile-Authentication-App",
    demo: "https://ade-maulana.my.id/",
  },

  {
    title: "Babinsa Messenger",
    slug: "babinsa-messenger",
    category: "Web App",
    year: "2024-2025",
    description:
      "Aplikasi komunikasi berbasis web dengan REST API untuk kebutuhan komunikasi.",
    technologies: ["Node.js", "Express.js", "MySQL"],
    image: "/projects/babinsa-messenger.jpg",
    github: "#",
    demo: "#",
  },
  {
    title: "Aplikasi Ecomerce Berbasis Web",
    slug: "aplikasi-ecommerce-berbasis-web",
    category: "Web App",
    year: "2024-2025",
    description:
      "Aplikasi Untuk membantu penjadual menjual produk secara online dengan fitur Preorder, dan manajemen produk.",
    technologies: ["Node.js", "Express.js", "MySQL"],
    image: "/projects/babinsa-messenger.jpg",
    github: "#",
    demo: "#",
  },
];