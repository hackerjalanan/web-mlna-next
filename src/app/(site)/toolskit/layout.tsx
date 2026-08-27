"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaQrcode,
  FaKey,
  FaImage,
  FaCode,
  FaPalette,
  FaExpand,
  FaCompress,
  FaEraser,
} from "react-icons/fa6";

const TOOLS = [
  { name: "QR Code Generator", href: "/toolskit/qr-code", icon: FaQrcode },
  { name: "Remove Background", href: "/toolskit/remove-background", icon:  FaEraser },
  { name: "Password Generator", href: "/toolskit/password-generator", icon: FaKey },
  { name: "Image Compressor", href: "/toolskit/image-compressor", icon: FaImage },
  { name: "JSON Formatter", href: "/toolskit/json-formatter", icon: FaCode },
  { name: "Color Palette", href: "/toolskit/color-palette", icon: FaPalette },
];

export default function ToolsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const activeTool = TOOLS.find((tool) => tool.href === pathname);

  const contentRef = useRef<HTMLElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(document.fullscreenElement === contentRef.current);
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!contentRef.current) return;

    if (!document.fullscreenElement) {
      await contentRef.current.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  return (
    <main className="min-h-screen px-3 py-8 md:px-6">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-8">
          <p className="mb-2 text-sm text-cyan-400">TOOLS</p>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Kumpulan utility.
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Beberapa tool kecil yang saya bangun untuk kebutuhan sehari-hari.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* SIDEBAR */}
          <aside className="rounded-sm border border-white/10 bg-slate-900/50 p-3 lg:sticky lg:top-16 lg:h-fit">
            <nav className="max-h-[70vh] space-y-1 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(34,211,238,0.4)_transparent]">
              {TOOLS.map((tool) => {
                const isActive = pathname === tool.href;
                const Icon = tool.icon;

                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className={`group relative flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors ${
                      isActive
                        ? "bg-cyan-400/10 font-medium text-cyan-400"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {/* active indicator bar */}
                    <span
                      className={`absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-cyan-400 transition-opacity ${
                        isActive
                          ? "opacity-100 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                          : "opacity-0"
                      }`}
                    />
                    <Icon
                      size={15}
                      className={
                        isActive
                          ? "text-cyan-400"
                          : "text-slate-500 transition-colors group-hover:text-slate-300"
                      }
                    />
                    <span>{tool.name}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* CONTENT */}
          <section
            ref={contentRef}
            className={`min-w-0 rounded-sm border border-white/10 bg-slate-900/50 p-5 md:p-6 ${
              isFullscreen ? "flex h-screen flex-col overflow-y-auto" : ""
            }`}
          >
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                {activeTool && (
                  <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-cyan-400/10 text-cyan-400">
                    <activeTool.icon size={16} />
                  </div>
                )}
                {activeTool && (
                  <h2 className="text-base font-semibold text-white">
                    {activeTool.name}
                  </h2>
                )}
              </div>

              <button
                onClick={toggleFullscreen}
                title={isFullscreen ? "Keluar dari fullscreen" : "Fullscreen"}
                className="flex h-8 w-8 items-center justify-center rounded-sm border border-white/10 text-slate-400 transition-colors hover:border-cyan-400/30 hover:text-cyan-400"
              >
                {isFullscreen ? <FaCompress size={13} /> : <FaExpand size={13} />}
              </button>
            </div>

            <div className={isFullscreen ? "flex-1" : ""}>{children}</div>
          </section>
        </div>
      </div>
    </main>
  );
}