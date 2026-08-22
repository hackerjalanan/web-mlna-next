import AdminNavbar from "@/app/(admin)/components/AdminNavbar";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="flex min-h-screen">

        <AdminNavbar />

        <main className="
          flex-1
          p-8
          h-screen
          overflow-y-auto
        ">
          {children}
        </main>

      </div>

    </div>
  );
}