import type { Metadata, Viewport } from "next";
import { Geist, Fraunces } from "next/font/google";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/site";
import { journeyLengthScript } from "@/components/scroll/journeyLength";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Display serif: Fraunces, a variable "Old Style soft" face. Its SOFT
// and WONK axes (set in globals.css) give the rounded, slightly
// unusual 1970s editorial letterforms the site's headings are built on;
// the opsz axis keeps it crisp and high-contrast at very large sizes.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const description = `${profile.name} — ${profile.tagline}. Computational and systems biology, research, and a Substack of personal essays.`;

// Icons and the share image come from the file conventions in this
// folder (icon.png, apple-icon.png, favicon.ico, opengraph-image.png,
// twitter-image.png); absolute URLs are built from siteUrl().
export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: profile.name, template: `%s — ${profile.name}` },
  description,
  applicationName: profile.name,
  authors: [{ name: profile.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: profile.name,
    title: profile.name,
    description,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: profile.name,
    description,
  },
  robots: { index: true, follow: true },
};

// viewport-fit=cover lets the paper and the 3D field run edge to edge
// behind a notch or home indicator; the nav, gutters and footer pad
// themselves with env(safe-area-inset-*) so content stays clear of them.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#faf7f1",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        {/* Sets the homepage's scroll length before first paint, so refreshes keep their place. */}
        <script dangerouslySetInnerHTML={{ __html: journeyLengthScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <SmoothScroll>
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
