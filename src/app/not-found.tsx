// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-center">
      <h1 className="text-6xl font-bold text-cyan-400">404</h1>
      <p className="mt-4 text-slate-400">
        Halaman yang kamu cari tidak ditemukan.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-cyan-400/10 px-4 py-2 text-sm text-cyan-400 hover:bg-cyan-400/20"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}