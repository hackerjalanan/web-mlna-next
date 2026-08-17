// app/layout/MainLayout.tsx
"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FireworkButton from "@/components/sections/FireworkButton";
import { useLoading } from "@/context/LoadingContext";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const { isPending } = useLoading();

  return (
    <>
      <Navbar open={open} setOpen={setOpen} />

      <main
        className={`min-h-screen transition-all duration-300
          pt- pb-24
          md:pt-0 md:pb-0
          ${open ? "md:ml-60" : "md:ml-20"}
        `}
      >
        <div className="mx-auto max-w-[1440px]">
          <Breadcrumb />
        </div>

        {/* Wrapper konten — loading cuma nutup ini */}
        <div className="relative min-h-[70vh]">
          {isPending ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-cyan-400 border-r-sky-500" />
                <span className="text-lg font-bold text-cyan-400">ADM</span>
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      </main>

      <FireworkButton />
    </>
  );
}