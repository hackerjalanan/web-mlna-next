"use client";

import {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import { menuItems } from "./MenuItems";

interface NavbarProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Navbar({ open, setOpen }: NavbarProps) {
  const [activeItem, setActiveItem] = useState("/");

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
  const handleMenuClick = (href: string) => {
    setActiveItem(href);

    // Kalau anchor section
    if (href.startsWith("#")) {
      const sectionId = href.replace("#", "");
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
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
            className={`flex h-10 items-center transition-all duration-300 ${
              open ? "ml-2 gap-2" : "w-full justify-center"
            }`}
          >
            <div
              className={`logo-gradient ${
                open ? "ml-8 h-10 w-12" : "h-10 w-14"
              }`}
              aria-label="MlnA Logo"
            />

            {open && (
              <span className="whitespace-nowrap text-xl font-bold leading-none tracking-tight text-white">
                MlnA
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
              onClick={() => handleMenuClick(item.href)}
              className={`flex items-center rounded-lg px-3 py-3 transition-all duration-200 ${
                getActiveClass(item.href)
              } ${open ? "gap-3" : "justify-center"}`}
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

      <div className="fixed left-0 top-0 z-40 flex w-full items-center justify-center border-b border-white/10 bg-slate-900/95 py-3 backdrop-blur-xl md:hidden">
        <div
          className={`logo-gradient ${
            open ? "h-10 w-12" : "h-10 w-14"
          }`}
          aria-label="MlnA Logo"
        />

        <h1 className="ml-2 text-lg font-bold text-white">
          MlnA
        </h1>
      </div>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
      ====================================================== */}

      <nav className="fixed bottom-0 left-0 z-50 grid w-full grid-cols-4 border-t border-white/10 bg-slate-900/95 px-2 py-2 text-white backdrop-blur-xl md:hidden">
        {menuItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            title={item.name}
            onClick={() => handleMenuClick(item.href)}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl py-2 transition-all duration-200 active:scale-95 ${
              getActiveClass(item.href)
            }`}
          >
            <span className="flex h-6 w-6 items-center justify-center">
              {item.icon}
            </span>

            <span className="text-xs font-medium">
              {item.name}
            </span>
          </a>
        ))}
      </nav>
    </>
  );
}