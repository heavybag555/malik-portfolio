import type { Metadata } from "next";
import "./globals.css";
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
      <head></head>
      <body className="antialiased">
        <SmoothScroll />
        <OverlayWrapper>{children}</OverlayWrapper>
      </body>
    </html>
  );
}
