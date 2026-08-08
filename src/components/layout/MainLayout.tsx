"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar open={open} setOpen={setOpen} />

      <main
        className={`min-h-screen transition-all duration-300
          pt-20 pb-24
          md:pt-0 md:pb-0
          ${
            open
              ? "md:ml-60"
              : "md:ml-20"
          }
        `}
      >
        {children}
      </main>
    </div>
  );
}
