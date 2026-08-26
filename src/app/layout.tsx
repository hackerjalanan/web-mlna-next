import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { LoadingProvider } from "@/context/LoadingContext";
import { Toaster } from "sonner";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d0d12",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ade-maulana.my.id"),

  title: {
    default: "Ade Maulana Hidayah | Fullstack Developer",
    template: "%s | Ade Maulana Hidayah",
  },

  description:
    "Portfolio Ade Maulana Hidayah, Fullstack Developer yang berfokus pada pengembangan aplikasi web menggunakan Laravel, Node.js, React.js, Next.js, dan database.",

  verification: {
    google: "xDHbp8yMfGPB_JcYTzwaKDMM7DhkSkfzmqycpRogdNQ",
  },

  keywords: [
    "Ade Maulana Hidayah",
    "Ade Maulana",
    "AD.EM",
    "ade_mlna",
    "Fullstack Developer",
    "Web Developer",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Next.js Developer",
    "React.js Developer",
    "Laravel Developer",
    "Node.js Developer",
    "JavaScript",
    "TypeScript",
    "PHP",
    "MySQL",
    "Web Developer Indonesia",
    "Fullstack Developer Indonesia",
  ],

  authors: [
    {
      name: "Ade Maulana Hidayah",
      url: "https://ade-maulana.my.id",
    },
  ],

  creator: "Ade Maulana Hidayah",
  publisher: "Ade Maulana Hidayah",

  alternates: {
    canonical: "https://ade-maulana.my.id",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://ade-maulana.my.id",
    siteName: "Ade Maulana Hidayah",

    title: "Ade Maulana Hidayah | Fullstack Developer",

    description:
      "Portfolio Ade Maulana Hidayah — Fullstack Developer dengan pengalaman dalam pengembangan aplikasi web menggunakan Laravel, Node.js, React.js, Next.js, dan MySQL.",

    // BARU: gambar preview saat link di-share (WA, Twitter, FB, LinkedIn, dll)
    // Siapkan file /public/og-image.png ukuran 1200x630px
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ade Maulana Hidayah - Fullstack Developer",
      },
    ],
  },

  twitter: {
    // "summary_large_image" menampilkan gambar full-width, lebih menarik
    // daripada "summary" yang hanya thumbnail kecil
    card: "summary_large_image",

    title: "Ade Maulana Hidayah | Fullstack Developer",

    description:
      "Portfolio Ade Maulana Hidayah — Fullstack Developer yang berfokus pada pengembangan aplikasi web.",

    // BARU
    images: ["/og-image.png"],
  },

  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon.ico",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
    ],

    shortcut: ["/favicon.ico"],

    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  manifest: "/site.webmanifest",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",

  name: "Ade Maulana Hidayah",

  // BARU: foto/logo untuk Knowledge Panel saat orang mencari namamu di Google
  image: "https://ade-maulana.my.id/og-image.png",

  jobTitle: "Fullstack Developer",

  description:
    "Fullstack Developer yang berfokus pada pengembangan aplikasi web menggunakan Laravel, Node.js, React.js, Next.js, JavaScript, dan MySQL.",

  url: "https://ade-maulana.my.id",

  sameAs: [
    "https://github.com/ademlna",
    "https://www.linkedin.com/in/ade-mlna",
    "https://www.instagram.com/ade_mlna",
  ],

  knowsAbout: [
    "Full Stack Development",
    "Web Development",
    "Frontend Development",
    "Backend Development",
    "Laravel",
    "PHP",
    "Node.js",
    "Express.js",
    "React.js",
    "Next.js",
    "JavaScript",
    "TypeScript",
    "MySQL",
    "PostgreSQL",
    "REST API",
    "Git",
    "GitHub",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BRS4WS2VSQ"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag() {
              window.dataLayer.push(arguments);
            }

            gtag('js', new Date());

            gtag('config', 'G-BRS4WS2VSQ');
          `}
        </Script>
      </head>

      <body className="min-h-full">
        <LoadingProvider>
          {children}
        </LoadingProvider>
        <Toaster
          position="top-right"
          richColors={false}
          toastOptions={{
            classNames: {
              toast:
                "!bg-slate-950 !border !border-cyan-400/40 !shadow-[0_0_20px_rgba(34,211,238,0.35)]",
              title: "!text-cyan-300 !font-semibold",
              description: "!text-slate-300",
              icon: "!text-cyan-400",
              closeButton:
                "!bg-slate-900 !border-cyan-400/30 !text-cyan-300 hover:!bg-slate-800",
              success:
                "!border-cyan-400/60 !shadow-[0_0_25px_rgba(34,211,238,0.5)]",
              error:
                "!border-red-400/50 !shadow-[0_0_20px_rgba(248,113,113,0.35)]",
              loading:
                "!border-cyan-400/40 !shadow-[0_0_15px_rgba(34,211,238,0.25)]",
            },
          }}
        />
      </body>
    </html>
  );
}