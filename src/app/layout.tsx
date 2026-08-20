import type { Metadata, Viewport } from "next";
import "./globals.css";
import Script from "next/script";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d0d12",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ade-maulana.my.id"),

  title: "Ade Maulana Hidayah | Fullstack Developer",

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
    },
  ],

  creator: "Ade Maulana Hidayah",

  openGraph: {
    title: "Ade Maulana Hidayah | Fullstack Developer",
    description:
      "Portfolio Ade Maulana Hidayah — Fullstack Developer dengan pengalaman dalam pengembangan aplikasi web menggunakan Laravel, Node.js, React.js, Next.js, dan MySQL.",
    url: "https://ade-maulana.my.id",
    siteName: "Ade Maulana Hidayah",
    locale: "id_ID",
    type: "website",

    images: [
      {
        url: "/favicon-192x192.png",
        width: 1200,
        height: 630,
        alt: "Ade Maulana Hidayah | Fullstack Developer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Ade Maulana Hidayah | Fullstack Developer",
    description:
      "Portfolio Ade Maulana Hidayah — Fullstack Developer yang berfokus pada pengembangan aplikasi web.",
    images: ["/favicon-192x192.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        url: "/favicon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],

    shortcut: "/favicon.ico",

    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
  },
};

/**
 * Structured Data / JSON-LD
 */
const jsonLd = {
  "@context": "https://ade-maulana.my.id",
  "@type": "Person",

  name: "Ade Maulana Hidayah",

  jobTitle: "Fullstack Developer",

  description:
    "Fullstack Developer yang berfokus pada pengembangan aplikasi web menggunakan Laravel, Node.js, React.js, Next.js, JavaScript, dan MySQL.",

  url: "https://ade-maulana.my.id",

  sameAs: [
    // Tambahkan URL sosial media kamu di sini
    "https://github.com/ademlna",
    "https://www.linkedin.com/ade-mlna",
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
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>

      <body className="min-h-full">
        {children}

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BRS4WS2VSQ"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BRS4WS2VSQ');
          `}
        </Script>
      </body>
    </html>
  );
}