import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/Toaster";
import { CommandPaletteProvider } from "@/components/CommandPaletteProvider";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { getProfile } from "@/actions/profile";

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

const FALLBACK_NAME = "Rasya Syahreza Maulana Zen";
const FALLBACK_HEADLINE = "Fullstack Developer & AI Engineer";
const FALLBACK_CONTACT = {
  email: "rasyasyahrezamaulanazen@gmail.com",
  phone: "+62 838 4055 9238",
  github: "https://github.com/rasyakt",
  linkedin: "https://linkedin.com/in/rasya-syahreza-maulana-zen",
};

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile().catch(() => null);
  const name = profile?.name || FALLBACK_NAME;
  return {
    title: `${name} — Fullstack Developer & AI Engineer`,
    description:
      `Portfolio of ${name} — ${profile?.headline || "Fullstack Mobile & Web Developer, AI Engineer, and CTO at BotHax"}.`,
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
    authors: [{ name }],
    creator: name,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://rasyakt.dev",
      title: `${name} — Fullstack Developer & AI Engineer`,
      description: profile?.bio || "Building enterprise systems, AI agents, and mobile apps.",
      siteName: `${name} Portfolio`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — Fullstack Developer & AI Engineer`,
      description: profile?.bio || "Building enterprise systems, AI agents, and mobile apps.",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile().catch(() => null);
  const name = profile?.name || FALLBACK_NAME;
  const contact = {
    email: profile?.email || FALLBACK_CONTACT.email,
    phone: profile?.phone || FALLBACK_CONTACT.phone,
    github: profile?.github || FALLBACK_CONTACT.github,
    linkedin: profile?.linkedin || FALLBACK_CONTACT.linkedin,
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: "https://rasyakt.dev",
    jobTitle: profile?.headline || FALLBACK_HEADLINE,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile?.location || "Ciamis, West Java, Indonesia",
      addressCountry: "ID",
    },
    sameAs: [contact.github, contact.linkedin, profile?.portfolioUrl || "https://gasela.my.id"],
  };
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("rasyakt-theme");if(!t){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})();`,
          }}
        />
      </head>
      <body>
        <CommandPaletteProvider contact={contact}>
          {children}
          <Toaster />
          <AnalyticsTracker />
        </CommandPaletteProvider>
      </body>
    </html>
  );
}
