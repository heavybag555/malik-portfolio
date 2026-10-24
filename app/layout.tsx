import type { Metadata } from "next";
import "./globals.css";
import OverlayWrapper from "./OverlayWrapper";
import SmoothScroll from "./components/SmoothScroll";
import SiteNav from "./components/SiteNav";
import PageTransition from "./components/PageTransition";
import { getSiteSettings } from "@/lib/content";

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
        <SmoothScroll />
        <SiteNav
          brandName={settings.brandName}
          brandSuffix={settings.brandSuffix}
          contactEmail={settings.contactEmail}
        />
        <OverlayWrapper>
          <PageTransition>{children}</PageTransition>
        </OverlayWrapper>
      </body>
    </html>
  );
}
