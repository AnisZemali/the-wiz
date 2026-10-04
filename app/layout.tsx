import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Noto_Sans_Arabic } from "next/font/google";

import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { SkipLink } from '@/components/layout/skip-link';
import { flagship } from "@/lib/catalogue";
import { product, site } from "@/lib/content";

import "./globals.css";
import { CartProvider } from "@/components/order/cart";

const arabic = Noto_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600", "700"], variable: "--font-arabic", display: "swap" });

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const description =
  "THE WIZ creates collections of revision books. MedWIZ — Medicine is the first: course summaries based on the Algerian curriculum, contents that become a progress tracker, facing notes pages and Extra Notes, in a minimal black-and-white handwritten style.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Revision books — MedWIZ and future collections`,
    template: `%s — ${site.name}`,
  },
  description,
  keywords: [
    "medical student book",
    "medicine study notes",
    "pharmacy student notes",
    "dental medicine notes",
    "anatomy summaries",
    "physiology notes",
    "semiology notes",
    "medical mnemonics",
    "study book",
    "The Wiz",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Premium study books for medical students`,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Premium study books for medical students`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "education",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

/**
 * The landing page sells the flagship, so it carries a Product entry —
 * described as itself, not as the whole series. Each book page emits its own.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${inter.variable} ${arabic.variable}`}>
      <body className="bg-paper text-ink antialiased">
        <SkipLink />
        <CartProvider><SmoothScroll>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </SmoothScroll></CartProvider>
      </body>
    </html>
  );
}
