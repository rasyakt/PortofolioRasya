import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/Toaster";
import { CommandPaletteProvider } from "@/components/CommandPaletteProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rasya Syahreza Maulana Zen — Fullstack Developer & AI Engineer",
  description:
    "Portfolio of Rasya Syahreza Maulana Zen — Fullstack Mobile & Web Developer, AI Engineer, and CTO at BotHax. 3x Kemenkumham HKI Copyright holder. LKS West Java 2026 Delegate.",
  keywords: [
    "Rasya Syahreza",
    "Fullstack Developer",
    "AI Engineer",
    "Laravel Developer",
    "Next.js Developer",
    "CTO BotHax",
    "LKS Jawa Barat",
    "Hak Cipta Kemenkumham",
    "Indonesia Developer",
    "Ciamis",
  ],
  authors: [{ name: "Rasya Syahreza Maulana Zen" }],
  creator: "Rasya Syahreza Maulana Zen",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://rasyakt.dev",
    title: "Rasya Syahreza — Fullstack Developer & AI Engineer",
    description:
      "Building enterprise systems, AI agents, and mobile apps. CTO at BotHax. 3x IP copyright holder. LKS West Java 2026.",
    siteName: "Rasya Syahreza Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rasya Syahreza — Fullstack Developer & AI Engineer",
    description: "Building enterprise systems, AI agents, and mobile apps.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("rasyakt-theme");if(!t){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})();`,
          }}
        />
      </head>
      <body>
        <CommandPaletteProvider>
          {children}
          <Toaster />
        </CommandPaletteProvider>
      </body>
    </html>
  );
}
