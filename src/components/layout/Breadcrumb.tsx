"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, FileText } from "lucide-react";

import { menuItems } from "@/data/menuItems";

export default function Breadcrumb() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  // /gallery → tidak muncul
  // /gallery/preview → muncul
  if (segments.length < 2) {
    return null;
  }

  return (
    <div
      className="
              fixed
              top-0
              z-50
              h-12
              w-full
              shrink-0
              border-b
              border-white/10
              bg-slate-950/95
              backdrop-blur-md
            "
      >

      <div className="flex h-10 items-center gap-1.5 px-3 text-xs font-medium text-slate-200">
        {segments.map((segment, index) => {
          const href =
            "/" + segments.slice(0, index + 1).join("/");

          const menuItem = menuItems.find(
            (item) => item.href === href,
          );

          const isLast = index === segments.length - 1;

          const label = menuItem?.name ?? formatName(segment);
          const Icon = menuItem?.icon ?? FileText;

          return (
            <div
              key={href}
              className="flex shrink-0 items-center gap-1.5"
            >
              {index > 0 && (
                <ChevronRight
                  size={13}
                  className="text-slate-600"
                />
              )}

              {isLast ? (
                <div className="flex items-center gap-1.5 text-slate-200">
                  <Icon size={14} />
                  <span>{label}</span>
                </div>
              ) : (
                <Link
                  href={href}
                  className="flex items-center gap-1.5 text-slate-400 transition-colors hover:text-cyan-400"
                >
                  <Icon size={14} />
                  <span>{label}</span>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
 
  );
}

function formatName(value: string) {
  return decodeURIComponent(value)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}