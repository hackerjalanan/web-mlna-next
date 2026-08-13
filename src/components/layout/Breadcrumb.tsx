"use client";

import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";

import { menuItems } from "@/data/menuItems";

export default function Breadcrumb() {
  const pathname = usePathname();

  // Cari halaman yang sedang aktif
  const current = menuItems.find(
    (item) => item.href === pathname,
  );

  // Home tidak perlu breadcrumb
  if (pathname === "/") {
    return null;
  }

  // Jika halaman tidak terdaftar di menu
  if (!current) {
    return (
      <nav className="px-4 py-3">
        <div
          className="
            flex items-center gap-1.5
            text-xs font-medium
            text-slate-200
          "
        >
          <FileText size={14} />
          <span>{formatName(pathname)}</span>
        </div>
      </nav>
    );
  }

  const Icon = current.icon;

  return (
    <nav className="px-4 py-3">
      <div
        className="
          flex items-center gap-1.5
          text-xs font-medium
          text-slate-200
        "
      >
        <Icon size={14} />
        <span>{current.name}</span>
      </div>
    </nav>
  );
}

function formatName(value: string) {
  return decodeURIComponent(value)
    .replace(/^\/+/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
} 