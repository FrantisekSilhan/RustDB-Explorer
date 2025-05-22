import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Rust Market Explorer",
    template: "%s | Rust Market Explorer",
  },
  description: "Track and analyze Rust item prices from the Steam marketplace",
  keywords: ["rust", "game", "market", "items", "steam", "prices", "skins"],
  authors: [{ name: "Rust Market Explorer Team" }],
  creator: "Rust Market Explorer Team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gray-950 text-white min-h-screen flex flex-col antialiased`}
      >
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
