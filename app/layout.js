import { Inter, Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-barlow" });
const barlowCondensed = Barlow_Condensed({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-barlow-condensed" });

export const metadata = {
  title: "CoachEasy AI — Train Hard. Coach Easy.",
  description:
    "AI-powered sports coaching marketplace connecting athletes with the perfect coaches and sessions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${barlow.variable} ${barlowCondensed.variable}`}>{children}</body>
    </html>
  );
}
