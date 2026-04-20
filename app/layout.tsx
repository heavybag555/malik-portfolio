import type { Metadata } from "next";
import "./globals.css";
import OverlayWrapper from "./OverlayWrapper";
import SmoothScroll from "./components/SmoothScroll";
import SiteNav from "./components/SiteNav";
import PageTransition from "./components/PageTransition";

export const metadata: Metadata = {
  title: "malik laing",
  description: "Photography portfolio of Malik",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body className="antialiased">
        <SmoothScroll />
        <SiteNav />
        <OverlayWrapper>
          <PageTransition>{children}</PageTransition>
        </OverlayWrapper>
      </body>
    </html>
  );
}
