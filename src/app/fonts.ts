import { Inter } from "next/font/google";

// Self-hosted at build time by next/font. Only the three weights the design uses.
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "900"],
  display: "swap",
  variable: "--font-inter",
});
