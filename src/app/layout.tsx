import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { LoadingProvider } from "@/context/LoadingContext";

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
  },

  twitter: {
    card: "summary",

    title: "Ade Maulana Hidayah | Fullstack Developer",

    description:
      "Portfolio Ade Maulana Hidayah — Fullstack Developer yang berfokus pada pengembangan aplikasi web.",
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
      </body>
    </html>
  );
}