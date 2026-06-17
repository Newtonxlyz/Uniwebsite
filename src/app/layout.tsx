import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { NavBar } from "@/components/nav-bar";

export const metadata: Metadata = {
  title: "吕元卓 · Lvyz Web",
  description: "车辆安全 × AI应用工程师 | 西安交大 · 14年经验",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="min-h-screen antialiased">
        <Providers>
          <NavBar />
          <main className="relative">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
