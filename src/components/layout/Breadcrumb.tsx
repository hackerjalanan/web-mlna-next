"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  Folder,
  User,
  Mail,
  Briefcase,
  FileText,
  Settings,
  type LucideIcon,
} from "lucide-react";

/* =====================================================
   TYPE
===================================================== */

interface BreadcrumbItem {
  label: string;
  icon: LucideIcon;
}
    
/* =====================================================
   BREADCRUMB DATA
   Cukup tambahkan halaman di sini
===================================================== */

const breadcrumbData: Record<string, BreadcrumbItem> = {
  "/project": {
    label: "Project",
    icon: Folder,
  },

  "/about": {
    label: "About",
    icon: User,
  },

  "/contact": {
    label: "Contact",
    icon: Mail,
  },

  "/experience": {
    label: "Experience",
    icon: Briefcase,
  },

  "/documents": {
    label: "Documents",
    icon: FileText,
  },

  "/settings": {
    label: "Settings",
    icon: Settings,
  },
};

/* =====================================================
   PROJECT DATA
   Cukup tambahkan project di sini
===================================================== */

const projectData: Record<string, BreadcrumbItem> = {
  "gunung-a": {
    label: "Gunung A",
    icon: FileText,
  },

  "babinsa-messenger": {
    label: "Babinsa Messenger System",
    icon: FileText,
  },

  "training-dashboard": {
    label: "Training Reporting Dashboard",
    icon: FileText,
  },

  "mlna-portfolio": {
    label: "MLNA Portfolio",
    icon: FileText,
  },
};

/* =====================================================
   BREADCRUMB
===================================================== */

export default function Breadcrumb() {
  const pathname = usePathname();

  const paths = pathname.split("/").filter(Boolean);

  /* ===================================================
     HOME
  =================================================== */

  if (pathname === "/") {
    return (
      <nav className="m-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-cyan-400"
        >
          <Home size={16} />
          <span>Home</span>
        </Link>
      </nav>
    );
  }

  /* ===================================================
     BREADCRUMB ITEMS
  =================================================== */

  return (
    <nav className="m-4 flex items-center gap-2 text-sm">
      {paths.map((path, index) => {
        const href = "/" + paths.slice(0, index + 1).join("/");
        const isLast = index === paths.length - 1;

        /* -----------------------------------------------
           DATA HALAMAN
        ----------------------------------------------- */

        let data = breadcrumbData[href];

        /* -----------------------------------------------
           DATA PROJECT DETAIL

           /project/gunung-a
        ----------------------------------------------- */

        if (
          paths[0] === "project" &&
          index === 1 &&
          projectData[path]
        ) {
          data = projectData[path];
        }

        /* -----------------------------------------------
           FALLBACK
        ----------------------------------------------- */

        if (!data) {
          data = {
            label: formatName(path),
            icon: FileText,
          };
        }

        const Icon = data.icon;

        return (
          <span
            key={href}
            className="flex items-center gap-2"
          >
            {/* Separator */}
            {index > 0 && (
              <span className="text-gray-600">
                ›
              </span>
            )}

            {/* Breadcrumb */}
            {isLast ? (
              <span className="flex items-center gap-1.5 text-white">
                <Icon size={16} />
                <span>{data.label}</span>
              </span>
            ) : (
              <Link
                href={href}
                className="flex items-center gap-1.5 text-gray-400 transition-colors hover:text-cyan-400"
              >
                <Icon size={16} />
                <span>{data.label}</span>
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

/* =====================================================
   FORMAT URL
===================================================== */

function formatName(value: string) {
  return decodeURIComponent(value)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}