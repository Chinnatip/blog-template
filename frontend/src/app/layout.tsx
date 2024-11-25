import type { Metadata } from "next";
import { Rubik, Noto_Sans_Thai } from "next/font/google";
import Navbar from "@/components/Navbar"
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin", "arabic"],
  variable: "--font-rubik",
});

const notoThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-noto-thai",
});

export const metadata: Metadata = {
  title: "DOPPIO",
  description: "this is sample project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${rubik.variable} ${notoThai.variable} font-primary bg-gray-100 antialiased min-h-screen`}
      >
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
