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
    title: "Redesign App Kasir Restoran",
    slug: "redesign-app-kasir-restoran",
    category: "UI/UX Design",
    year: "2024",
    description:
      "Mendesain ulang tampilan kasir dari nol dengan pendekatan user-centered design untuk menciptakan alur kerja yang lebih cepat dan interaksi yang lebih jelas.",
    technologies: ["Figma", "Prototype", "Tailwind CSS"],
    image: "/projects/kasir-restoran.jpg",
    featured: true,
  },

  {
    title: "Sistem Inventori Laravel",
    slug: "sistem-inventori-laravel",
    category: "Web App",
    year: "2024",
    description:
      "Aplikasi manajemen stok barang berbasis web dengan autentikasi berbasis role dan fitur laporan otomatis.",
    technologies: ["Laravel", "MySQL", "Bootstrap"],
    image: "/projects/inventori-laravel.jpg",
  },

  {
    title: "Urban Portrait Series",
    slug: "urban-portrait-series",
    category: "Photography",
    year: "2023",
    description:
      "Seri fotografi portrait dengan konsep urban dan pencahayaan natural untuk kebutuhan personal branding.",
    technologies: ["Portrait", "Lightroom"],
    image: "/projects/urban-portrait.jpg",
  },

  {
    title: "Dashboard Admin Klinik",
    slug: "dashboard-admin-klinik",
    category: "UI/UX Design",
    year: "2024",
    description:
      "Perancangan UI dashboard untuk mengelola data pasien, jadwal dokter, serta laporan keuangan klinik.",
    technologies: ["Figma", "Auto Layout"],
    image: "/projects/dashboard-klinik.jpg",
  },

  {
    title: "API REST Manajemen Tugas",
    slug: "api-rest-manajemen-tugas",
    category: "Web App",
    year: "2024",
    description:
      "Backend REST API untuk aplikasi manajemen proyek dengan autentikasi JWT dan dokumentasi API.",
    technologies: ["Laravel", "JWT", "REST API"],
    image: "/projects/api-manajemen-tugas.jpg",
  },

  {
    title: "Brand Identity — Warung Kopi",
    slug: "brand-identity-warung-kopi",
    category: "Branding",
    year: "2023",
    description:
      "Perancangan identitas visual untuk brand kopi lokal yang mencakup logo, palet warna, dan tipografi.",
    technologies: ["Illustrator", "Photoshop"],
    image: "/projects/warung-kopi.jpg",
  },

  {
    title: "Mobile App Pemesanan Laundry",
    slug: "mobile-app-pemesanan-laundry",
    category: "UI/UX Design",
    year: "2024",
    description:
      "Desain aplikasi mobile untuk layanan laundry on-demand yang mencakup onboarding, pemesanan, dan tracking pesanan.",
    technologies: ["Figma", "FigJam"],
    image: "/projects/laundry.jpg",
  },
];