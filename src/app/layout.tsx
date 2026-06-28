import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers";
import { Suspense } from "react";
import { TopProgressBar } from "@/components/ui/page-loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://mindful.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "BlogMint | Modern Blogging Platform",
    template: "%s | BlogMint",
  },

  description:
    "BlogMint is a modern blogging platform for technology, programming, AI, software engineering, web development, and productivity.",

  applicationName: "BlogMint",

  keywords: [
    "BlogMint",
    "Blog",
    "Programming",
    "Software Engineering",
    "Next.js",
    "React",
    "TypeScript",
    "JavaScript",
    "Artificial Intelligence",
    "Web Development",
    "Backend Development",
    "Frontend Development",
    "Node.js",
    "NestJS",
    "Express",
    "Tech Articles",
    "Developer Blog",
    "Coding Tutorials",
  ],

  authors: [
    {
      name: "BlogMint Team",
      url: siteUrl,
    },
  ],

  creator: "BlogMint",

  publisher: "BlogMint",

  category: "Technology",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    title: "BlogMint | Modern Blogging Platform",
    description:
      "Explore high-quality articles about programming, AI, software engineering, and modern web development.",

    url: siteUrl,

    siteName: "BlogMint",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/icon.svg",
        width: 1200,
        height: 630,
        alt: "BlogMint Blog",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "BlogMint",
    description:
      "Modern programming tutorials, AI articles, and software engineering blogs.",

    images: ["/icon.svg"],
  },

  icons: {
    icon: ["/icon.svg", "/icon.svg"],
    apple: "/icon.svg",
  },

  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
