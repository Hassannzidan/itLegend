import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/** Absolute origin used to resolve canonical/OpenGraph URLs. Set
 *  NEXT_PUBLIC_SITE_URL per environment; falls back to localhost in dev. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  // Base for every relative URL-based metadata field (canonical, og:url, ...),
  // so page-level metadata can use clean relative paths that resolve to absolute.
  metadataBase: new URL(siteUrl),
  title: {
    default: "IT Legend — Online Courses",
    template: "%s | IT Legend",
  },
  description: "Explore course curriculum, materials and reviews.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={leagueSpartan.variable}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
