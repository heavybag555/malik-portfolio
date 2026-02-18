import localFont from "next/font/local";
import { Libre_Baskerville } from "next/font/google";

export const labMono = localFont({
  src: "../Lab-Mono-master/LabMono-Regular.otf",
  variable: "--font-lab-mono",
  display: "swap",
});

export const libreBaskerville = Libre_Baskerville({
  weight: "700",
  style: "italic",
  subsets: ["latin"],
  variable: "--font-libre-baskerville",
  display: "swap",
});
