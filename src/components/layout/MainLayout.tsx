"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Footer from "@/components/layout/Footer";
import { useLoading } from "@/context/LoadingContext";
import Loading from "@/context/Loading";
import { usePathname } from "next/navigation";
import FloatingMenu from '@/components/FloatingMenu';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const { isPending } = useLoading();

  const pathname = usePathname();

  const isGalleryPreview = pathname.startsWith("/gallery/preview");
  const hideFooter = isGalleryPreview;

  return (
    <div className={isGalleryPreview ? "h-dvh overflow-hidden" : "min-h-screen"}>
      <Navbar open={open} setOpen={setOpen} />

      <main
        className={`flex flex-col transition-all duration-300 ${isGalleryPreview ? "h-dvh overflow-hidden" : "min-h-screen"} ${open ? "md:ml-60" : "md:ml-20"}`}
      >
        {/* BREADCRUMB */}
        {!isPending && (
          <div className="mx-auto w-full max-w-[1440px] shrink-0">
            <Breadcrumb />
          </div>
        )}

        {/* PAGE CONTENT */}
        <div className={`relative flex-1 min-h-0 ${isGalleryPreview ? "bg-black overflow-hidden" : ""}`}>
          {isPending ? (
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
              <Loading />
            </div>
          ) : (
            children
          )}
        </div>

        {/* FOOTER */}
        {!isPending && !hideFooter && (
          <div className="mx-auto w-full max-w-[1440px] shrink-0">
            <Footer />
          </div>
        )}
      </main>

      <FloatingMenu />
    </div>
  );
}