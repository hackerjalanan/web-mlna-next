"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useLoading } from "@/context/LoadingContext";
import { menuItems } from "./MenuItems";
import { cinzel } from "@/lib/fonts";

export default function Navbar() {
  const [activeItem, setActiveItem] = useState("/");
  const [mobileOpen, setMobileOpen] = useState(false);

  const { navigate } = useLoading();

  // =====================================================
  // ACTIVE MENU
  // =====================================================
  useEffect(() => {
    const sectionItems = menuItems.filter((item) =>
      item.href.startsWith("#")
    );

    const handleScroll = () => {
      const currentPath = window.location.pathname;

      // Route selain homepage
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

      // Homepage tanpa section
      if (sectionItems.length === 0) {
        setActiveItem("/");
        return;
      }

      // Deteksi section aktif
      let currentSection = "/";

      sectionItems.forEach((item) => {
        const sectionId = item.href.slice(1);
        const section = document.getElementById(sectionId);

        if (!section) return;

        const { top } = section.getBoundingClientRect();

        if (top <= window.innerHeight * 0.35) {
          currentSection = item.href;
        }
      });

      setActiveItem(currentSection);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // =====================================================
  // LOCK BODY SCROLL
  // =====================================================
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // =====================================================
  // MENU CLICK
  // =====================================================
  const handleMenuClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setActiveItem(href);
    setMobileOpen(false);

    // Anchor / section
    if (href.startsWith("#")) {
      e.preventDefault();

      const sectionId = href.slice(1);
      const section = document.getElementById(sectionId);

      section?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      return;
    }

    // Route
    e.preventDefault();
    navigate(href);
  };

  // =====================================================
  // ACTIVE CLASS
  // =====================================================
  const getActiveClass = (href: string) => {
    return activeItem === href
      ? "text-white"
      : "text-white/50 hover:text-white";
  };

  // =====================================================
  // LOGO
  // =====================================================
  const Logo = () => (
    <Link
      href="/"
      onClick={(e) => handleMenuClick(e, "/")}
      className="flex items-center gap-2"
      aria-label="AD.EM Home"
    >
      <Image
        src="/favicon.svg"
        alt=""
        width={40}
        height={36}
        className="h-9 w-10"
        aria-hidden="true"
      />

      <span
        className={`${cinzel.className} text-xl font-medium leading-none tracking-[0.08em] text-white`}
      >
        AD<span className="text-[#8B5CF6]">.</span>EM
      </span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">
      {/* =================================================
          NAVBAR
      ================================================= */}
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* Logo */}
        <Logo />

        {/* =================================================
            DESKTOP / TABLET
        ================================================= */}
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Primary navigation"
        >
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => handleMenuClick(e, item.href)}
              className={`relative py-2 text-sm font-medium transition-colors ${getActiveClass(
                item.href
              )}`}
            >
              {item.name}

              {activeItem === item.href && (
                <motion.span
                  layoutId="navbar-active"
                  className="absolute -bottom-[1px] left-0 h-px w-full bg-[#8B5CF6]"
                  aria-hidden="true"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* =================================================
            MOBILE BUTTON
        ================================================= */}
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="relative z-[70] flex h-9 w-9 items-center justify-center text-white transition-colors hover:text-[#8B5CF6] md:hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <X size={22} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={22} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* =================================================
          MOBILE SIDE DRAWER
      ================================================= */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* ---------------------------------------------
                BACKDROP
            --------------------------------------------- */}
            <motion.button
              type="button"
              aria-label="Close mobile menu"
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />

            {/* ---------------------------------------------
                SIDE PANEL
                50% SCREEN
            --------------------------------------------- */}
            <motion.aside
              className="
                fixed
                right-0
                top-0
                z-50
                flex
                h-dvh
                w-1/2
                min-w-[240px]
                max-w-[420px]
                flex-col
                border-l
                border-white/10
                bg-[#050505]
                shadow-[-20px_0_60px_rgba(0,0,0,0.45)]
                md:hidden
              "
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* -------------------------------------------
                  PANEL HEADER
              ------------------------------------------- */}
              <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                   {"AD </> EM"}
                </span>
              </div>

              {/* -------------------------------------------
                  MENU
              ------------------------------------------- */}
              <nav
                className="flex flex-1 flex-col px-4 py-6"
                aria-label="Mobile navigation"
              >
                {menuItems.map((item, index) => {
                  const isActive = activeItem === item.href;

                  return (
                    <motion.div
                      key={item.name}
                      initial={{
                        opacity: 0,
                        x: 20,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        duration: 0.3,
                        delay: 0.08 + index * 0.05,
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={(e) =>
                          handleMenuClick(e, item.href)
                        }
                        className={`
                          group
                          relative
                          flex
                          items-center
                          justify-between
                          border-b
                          border-white/[0.06]
                          px-2
                          py-4
                          text-sm
                          font-medium
                          transition-all
                          duration-200
                          ${
                            isActive
                              ? "text-white"
                              : "text-white/45 hover:text-white"
                          }
                        `}
                      >
                        <span>{item.name}</span>

                        <span
                          className={`
                            h-1.5
                            w-1.5
                            rounded-full
                            transition-all
                            duration-200
                            ${
                              isActive
                                ? "bg-[#8B5CF6] shadow-[0_0_10px_rgba(139,92,246,0.7)]"
                                : "bg-white/10 group-hover:bg-white/40"
                            }
                          `}
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* -------------------------------------------
                  PANEL FOOTER
              ------------------------------------------- */}
              <div className="border-t border-white/10 px-6 py-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">
                  AD.EM / Portfolio
                </p>

                <p className="mt-2 text-xs leading-5 text-white/35">
                  Fullstack Programmer
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}