import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import OverlayWrapper from "./OverlayWrapper";
import SmoothScroll from "./components/SmoothScroll";
import SiteNav from "./components/SiteNav";
import PageTransition from "./components/PageTransition";
import SafariEdgeBackground from "./components/SafariEdgeBackground";
import { getSiteSettings } from "@/lib/content";
import { PAGE_BACKGROUND } from "./theme-color";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: PAGE_BACKGROUND,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.metaTitle,
    description: settings.metaDescription,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en">
      <head></head>
      <body className="antialiased">
        <SafariEdgeBackground />
        <SmoothScroll />
        <SiteNav
          brandName={settings.brandName}
          brandSuffix={settings.brandSuffix}
          contactEmail={settings.contactEmail}
        />
        <OverlayWrapper>
          <PageTransition>{children}</PageTransition>
        </OverlayWrapper>
        <Analytics />
      </body>
    </html>
  );
}
