export type GuideCategory =
  | "All"
  | "Terminal"
  | "Next.js"
  | "React"
  | "Laravel"
  | "Database"
  | "Git"
  | "Troubleshooting";

export interface Guide {
  id: number;
  title: string;
  description: string;
  category: Exclude<GuideCategory, "All">;
  date: string;
  readTime: string;
  content: string;
  code?: string;
  language?: string;
}

export const guides: Guide[] = [
  {
    id: 1,
    title: "Basic Terminal Commands",
    description:
      "Perintah terminal yang sering digunakan saat development.",
    category: "Terminal",
    date: "2026-08-13",
    readTime: "3 min",
    content:
      "Beberapa command dasar untuk berpindah folder, membuat file, melihat isi directory, dan menjalankan aplikasi.",
    code: `pwd
ls
cd project
mkdir components
touch index.ts
npm install
npm run dev`,
    language: "bash",
  },

  {
    id: 2,
    title: "Menjalankan Next.js",
    description:
      "Cara menjalankan project Next.js melalui terminal.",
    category: "Next.js",
    date: "2026-08-12",
    readTime: "2 min",
    content:
      "Install dependency terlebih dahulu kemudian jalankan development server.",
    code: `npm install
npm run dev`,
    language: "bash",
  },

  {
    id: 3,
    title: "React Component",
    description:
      "Contoh struktur component sederhana menggunakan React.",
    category: "React",
    date: "2026-08-11",
    readTime: "4 min",
    content:
      "Component React dapat digunakan untuk membagi interface menjadi bagian-bagian yang lebih mudah dikelola.",
    code: `export default function Button() {
  return (
    <button>
      Click Me
    </button>
  );
}`,
    language: "tsx",
  },

  {
    id: 4,
    title: "Git Workflow",
    description:
      "Command Git dasar untuk menyimpan perubahan project.",
    category: "Git",
    date: "2026-08-10",
    readTime: "3 min",
    content:
      "Gunakan Git untuk mencatat perubahan kode dan mengirim project ke repository.",
    code: `git status
git add .
git commit -m "update project"
git push origin main`,
    language: "bash",
  },

  {
    id: 5,
    title: "Database Migration",
    description:
      "Perintah dasar migration database.",
    category: "Database",
    date: "2026-08-09",
    readTime: "4 min",
    content:
      "Migration digunakan untuk membuat dan mengubah struktur database secara terorganisir.",
    code: `php artisan make:migration create_users_table

php artisan migrate

php artisan migrate:rollback`,
    language: "bash",
  },

  {
    id: 6,
    title: "Troubleshooting npm",
    description:
      "Beberapa langkah ketika dependency project mengalami masalah.",
    category: "Troubleshooting",
    date: "2026-08-08",
    readTime: "3 min",
    content:
      "Jika dependency bermasalah, dependency dapat dihapus kemudian di-install kembali.",
    code: `rm -rf node_modules
rm package-lock.json
npm install`,
    language: "bash",
  },
];