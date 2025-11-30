import type { Metadata } from "next";
import "./globals.css";
import { labMono } from "./fonts";
import OverlayWrapper from "./OverlayWrapper";
import SmoothScroll from "./components/SmoothScroll";

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
      <head>
        <link
          rel="preload"
          href="/malik-info.jpg"
          as="image"
          type="image/jpeg"
        />
      </head>
      <body className={`${labMono.variable} antialiased`}>
        <SmoothScroll />
        <OverlayWrapper>{children}</OverlayWrapper>
      </body>
    </html>
  );
}
