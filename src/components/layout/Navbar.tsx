"use client";

import {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import { useLoading } from "@/context/LoadingContext";
import { menuItems } from "./MenuItems";
import { cinzel } from "@/lib/fonts";


interface NavbarProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Navbar({ open, setOpen }: NavbarProps) {
  const [activeItem, setActiveItem] = useState("/");
  const { navigate } = useLoading();

  // =====================================================
  // TABLET SIDEBAR BEHAVIOR
  // =====================================================
  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(min-width: 768px) and (max-width: 1023px)"
    );

    const handleTablet = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    handleTablet(mediaQuery);

    mediaQuery.addEventListener("change", handleTablet);

    return () => {
      mediaQuery.removeEventListener("change", handleTablet);
    };
  }, [setOpen]);

  // =====================================================
  // ACTIVE MENU
  // =====================================================
  useEffect(() => {
    const sectionItems = menuItems.filter((item) =>
      item.href.startsWith("#")
    );

    // Tidak ada section menu
    if (sectionItems.length === 0) {
      setActiveItem(window.location.pathname);
      return;
    }

    const handleScroll = () => {
      const currentPath = window.location.pathname;

      // -------------------------------------------------
      // ROUTE / NORMAL PAGE
      // -------------------------------------------------
      if (currentPath !== "/") {
        const currentRoute = menuItems.find(
          (item) =>
            !item.href.startsWith("#") &&
            item.href !== "/" &&
            currentPath.startsWith(item.href)
        );

        setActiveItem(currentRoute?.href ?? currentPath);
        return;
      }

      // -------------------------------------------------
      // HOME PAGE + SECTION
      // -------------------------------------------------
      let currentSection = "/";

      sectionItems.forEach((item) => {
        const sectionId = item.href.replace("#", "");
        const section = document.getElementById(sectionId);

        if (section) {
          const rect = section.getBoundingClientRect();

          if (rect.top <= window.innerHeight * 0.35) {
            currentSection = item.href;
          }
        }
      });

      setActiveItem(currentSection);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // =====================================================
  // HANDLE MENU CLICK
  // =====================================================
  const handleMenuClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setActiveItem(href);

    // Kalau anchor section (mis. "#tentang")
    if (href.startsWith("#")) {
      e.preventDefault();
      const sectionId = href.replace("#", "");
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      return;
    }

    // Route biasa (mis. "/admin", "/projects")
    // Cegah full page reload, pakai client-side navigation
    // supaya Navbar & MainLayout tidak ikut unmount
    e.preventDefault();
    navigate(href);
  };

  // =====================================================
  // ACTIVE CLASS
  // =====================================================
  const getActiveClass = (href: string) => {
    return activeItem === href
      ? "bg-cyan-500/10 text-cyan-400"
      : "text-slate-300 hover:bg-slate-800 hover:text-cyan-400";
  };

  return (
    <>
      {/* =====================================================
          DESKTOP
          lg ke atas
      ====================================================== */}

      <aside
        className={`fixed left-0 top-0 z-50 hidden min-h-screen bg-slate-900 p-4 text-white transition-all duration-300 md:block ${
          open ? "w-60" : "w-20"
        }`}
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="group relative mb-10 flex h-10 items-center">
          {/* LOGO + TEXT */}
          <div
            className={`flex h-10  items-center transition-all duration-300 ${
              open ? "ml-2 gap-2" : "w-full justify-center"
            }`}
          >
            <div
              className={`logo-gradient ${
                open ? "ml-8 h-10 w-12" : "h-10 w-14"
              }`}
              aria-label="AD.EM Logo"
            />

            {open && (
             <span
                className={`${cinzel.className} relative top-1 whitespace-nowrap text-2xl font-medium-bold leading-none tracking-[0.08em] text-white`}
              >
                AD<span className="text-cyan-400">.</span>EM
              </span>
            )}
          </div>

          {/* TOGGLE */}
          <button
            onClick={() => setOpen(!open)}
            className={`absolute flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 transition-all duration-200 hover:bg-slate-800 hover:text-white ${
              open
                ? "left-0"
                : "left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100"
            }`}
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          >
            ☰
          </button>
        </div>

        {/* =====================================================
            MENU
        ===================================================== */}

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              title={item.name}
              onClick={(e) => handleMenuClick(e, item.href)}
              className={`flex items-center rounded-lg px-3 py-3 transition-all duration-200 ${getActiveClass(
                item.href
              )} ${open ? "gap-3" : "justify-center"}`}
            >
              {/* ICON */}
              <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                {item.icon}
              </span>

              {/* NAME */}
              {open && (
                <span className="whitespace-nowrap text-sm font-medium">
                  {item.name}
                </span>
              )}
            </a>
          ))}
        </nav>
      </aside>

      {/* =====================================================
          MOBILE HEADER
      ====================================================== */}

      <div className="left-0 top-0 z-40 flex h-11 w-full items-center justify-center border-b border-white/10 bg-slate-900/95 backdrop-blur-xl md:hidden">
        <div
          className={`logo-gradient ${open ? "h-12 w-11" : "h-12 w-11"}`}
          aria-label="AD.EM Logo"
        />

        <h1 className={`${cinzel.className} text-3xl font-medium-bold relative top-1 leading-none tracking-[0.08em] text-white`}> AD.EM</h1>
      </div>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
      ====================================================== */}

      <nav
        className="
          fixed bottom-0 left-0 z-50
          grid w-full
          border-t border-white/10
          bg-slate-900/95
          px-2 py-2
          text-white
          backdrop-blur-xl
          md:hidden
        "
        style={{
          gridTemplateColumns: `repeat(${menuItems.length}, minmax(0, 1fr))`,
        }}
      >
        {menuItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            title={item.name}
            onClick={(e) => handleMenuClick(e, item.href)}
            className={`
              flex flex-col
              items-center justify-center
              gap-1 rounded-xl py-2
              transition-all duration-200
              active:scale-95
              ${getActiveClass(item.href)}
            `}
          >
            <span className="flex h-6 w-6 items-center justify-center">
              {item.icon}
            </span>

            <span className="text-[10px] font-medium">{item.name}</span>
          </a>
        ))}
      </nav>
    </>
  );
}