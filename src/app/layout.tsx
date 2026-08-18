import type { Metadata } from "next";
import MainLayout from "@/components/layout/MainLayout";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://ade-maulana.my.id'),
  title: "Ade Maulana Hidayah",
  description: "Personal portfolio of Ade Maulana Hidayah",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' }, // <-- diperbaiki nama file
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  openGraph: {
    title: "Ade Maulana Hidayah",
    description: "Personal portfolio of Ade Maulana Hidayah",
    url: "https://ade-maulana.my.id",   
    siteName: "Ade Maulana Hidayah",
    locale: "id_ID",
    type: "website",
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