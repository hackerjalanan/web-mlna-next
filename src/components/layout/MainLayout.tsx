"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FireworkButton from "@/components/sections/FireworkButton";
import { useLoading } from "@/context/LoadingContext";
import Footer from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const { isPending } = useLoading();

  return (
    <div className="min-h-screen">
      <Navbar open={open} setOpen={setOpen} />

      <main
        className={`
          min-h-screen
          flex
          flex-col
          transition-all
          duration-300
          pt-0
          md:pt-0
          ${open ? "md:ml-60" : "md:ml-20"}
        `}
      >
       {!isPending && (
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
          <div className="mx-auto w-full max-w-[1440px]">
            <Breadcrumb />
          </div>
        </div>
      )}

        {/* CONTENT */}
        <div className="relative flex-1 min-h-0">
          {isPending ? (
            <div className="absolute inset-0 z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950/90 md:min-h-screen ">
              <div className="flex flex-col items-center gap-3">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-cyan-400 border-r-sky-500" />

                  <span className="text-lg font-bold text-cyan-400">
                    ADM
                  </span>
                </div>

                <span className="text-sm font-medium text-slate-400">
                  Loading...
                </span>
              </div>
            </div>
          ) : (
            children
          )}
        </div>

        {/* FOOTER */}
        {!isPending && (
          <div className="mx-auto w-full max-w-[1440px] shrink-0">
            <Footer />
          </div>
        )}
      </main>

      <FireworkButton />
    </div>
  );
}
