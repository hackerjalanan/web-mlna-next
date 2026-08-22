"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight, 
  Home,
  ImageIcon,
  FolderKanban,
  BookOpenText,
  UserRound,
} from "lucide-react";

import Image from "next/image";
import { cinzel } from "@/lib/fonts";


const navItems = [
  { name: "Home", href: "/admin/dashboard", icon: Home },
  { name: "Galeri", href: "/admin/gallery", icon: ImageIcon },
  { name: "Projek", href: "/admin/projek", icon: FolderKanban },
  { name: "Guide", href: "/admin/guide", icon: BookOpenText },
  { name: "About", href: "/admin/about", icon: UserRound },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        className={[
          "hidden lg:flex left-0 top-0 z-40 h-dvh  flex-col  overflow-hidden border-r border-white/10 bg-slate-950/95 transition-all duration-300",
          isOpen ? "w-50" : "w-15",
        ].join(" ")}
      >

        {/* Header Sidebar */}
        <div
          className={[
            "mb-1 flex items-center",
            isOpen ? "justify-between px-1" : "justify-center",
          ].join(" ")}
        >

          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-200 hover:bg-slate-700"
          >
            ☰
          </button>


          {isOpen && (
            <div className="flex mr-10">
              <Image
                src="/icon.svg"
                alt="Ade Maulana"
                width={120}
                height={40}
                className="h-8 w-auto"
              />

              <h1 className={`${cinzel.className} text-2xl text-white`}>
                AD.EM
              </h1>
            </div>
          )}

        </div>


        {/* menu desktop tetap */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={[
                  "flex items-center rounded-lg text-slate-300 transition-all duration-200 hover:bg-slate-800 hover:text-white",
                  isOpen
                    ? "gap-3 px-3 py-3"
                    : "justify-center px-0 py-3",
                ].join(" ")}
                title={!isOpen ? item.name : undefined}
              >
                <Icon
                  size={17}
                  className="shrink-0"
                />

                {isOpen && (
                  <span>
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>


        {/* Admin bawah */}
        <div className="mt-auto w-full border-t border-white/10 p-3">
          {isOpen ? (
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-cyan-700
                  text-sm
                  font-semibold
                  text-white
                "
              >
                A
              </div>

              {/* Nama */}
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  Admin
                </p>

                <p className="truncate text-sm font-semibold text-white">
                  Ade Maulana
                </p>
              </div>
            </div>
          ) : (
            <div className="flex w-full justify-center">
              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-cyan-700
                  text-sm
                  font-semibold
                  text-white
                "
              >
                A
              </div>
            </div>
          )}
        </div>


      </aside>



      {/* ================= MOBILE TOP NAV ================= */}
      <header
        className="
        fixed
        top-0
        left-0
        z-50
        flex
        h-14
        w-full
        items-center
        justify-between
        border-b
        border-white/10
        bg-slate-950/95
        px-3
        lg:hidden
        "
      >

        {/* tombol nav */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation"
          className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          text-slate-200
          hover:bg-slate-800
          "
        >
          ☰
        </button>


        {/* logo tengah */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center">

          <Image
            src="/icon.svg"
            alt="Ade Maulana"
            width={35}
            height={35}
            className="h-7 w-auto"
          />

          <h1
            className={`${cinzel.className} text-xl tracking-widest text-white`}
          >
            AD.EM
          </h1>

        </div>



        {/* admin kanan */}
        <div className="flex items-center gap-2">

          <div className="text-right">
            <p className="text-[9px] uppercase tracking-widest text-slate-400">
              Admin
            </p>

            <p className="text-xs font-semibold text-white">
              Ade
            </p>
          </div>


          <div
            className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-gradient-to-br
            from-cyan-400
            to-cyan-600
            font-bold
            text-slate-950
            "
          >
            A
          </div>

        </div>


      </header>

      {/* Mobile drawer / overlay with slide animation and 30% width */}
      <div
        className={[
          "fixed inset-0 top-14 z-40 lg:hidden transition-opacity duration-300",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={() => setMobileOpen(false)}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />


        {/* Drawer */}
        <aside
          className={[
            "fixed left-0 top-14 z-50",
            "h-[calc(100vh-56px)]",
            "bg-slate-950/95",
            "border-r border-white/10",
            "p-4",
            "transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full",
            "w-[50vw] sm:w-[30vw]",
          ].join(" ")}
          onClick={(e) => e.stopPropagation()}
        >

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-md
                    px-3
                    py-3
                    text-slate-300
                    transition-all
                    duration-200
                    hover:bg-slate-800
                    hover:text-white
                  "
                >
                  <Icon size={17} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

        </aside>
      </div>


    </>
  );
}