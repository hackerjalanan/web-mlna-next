  import type { Metadata } from "next";
  import MainLayout from "@/components/layout/MainLayout";
  import "./globals.css";

  export const metadata: Metadata = {
    title: "Ade Maulana",
    description: "Personal portfolio of Ade Maulana",
    icons: {
      icon: "/logo-am.svg",
    },
  };

  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="id">
        <body>
          <MainLayout>
            {children}
          </MainLayout>
        </body>
      </html>
    );
  } 