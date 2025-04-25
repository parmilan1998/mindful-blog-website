import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "./index.css";
import MainLayout from "@/layout/MainLayout";
import React from "react";

const poppins = Poppins({
  variable: "--font-geist-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mindful Blogs",
  description: "Mindful Blog Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <div>
          <MainLayout>{children}</MainLayout>
        </div>
      </body>
    </html>
  );
}
