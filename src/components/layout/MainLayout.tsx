"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <>
      <Navbar open={open} setOpen={setOpen} />

      <main
        className={`min-h-screen transition-all duration-300
          pt-20 pb-24
          md:pt-0 md:pb-0
          ${open ? "md:ml-60" : "md:ml-20"}
        `}
      >
        {/* Breadcrumb otomatis di semua halaman */}
        <div className="mx-auto max-w-[1440px] ">
          <Breadcrumb />
        </div>

        {children}
      </main> 
    </>
  );
}