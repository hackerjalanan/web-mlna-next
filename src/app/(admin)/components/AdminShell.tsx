"use client";

import AdminNavbar from "@/app/(admin)/components/AdminNavbar";
import { usePathname } from "next/navigation";

// Route yang tidak perlu tampilkan navbar admin (misal halaman login terpisah)
const HIDE_NAVBAR_ON = ["/login"];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbar = HIDE_NAVBAR_ON.some((path) => pathname?.startsWith(path));

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        {!hideNavbar && <AdminNavbar />}
        <main className="h-screen flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}