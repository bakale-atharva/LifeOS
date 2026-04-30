import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/layout/TopBar";
import Sidebar from "@/components/layout/Sidebar";
import StoreSync from "@/components/layout/StoreSync";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LifeOS | Master Your Reality",
  description: "Gamified life management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-950 text-zinc-50 overflow-hidden`}>
        <StoreSync />
        <TopBar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-zinc-950">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
