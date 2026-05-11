import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AgeGate } from "@/components/layout/AgeGate";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { GSAPProvider } from "@/components/providers/GSAPProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mundo Gin | Italian Coffee Dry Gin",
  description:
    "Scopri Mundo Gin. Un gin contemporaneo, autentico, capace di distinguersi al palato e alla vista.",
  icons: {
    icon: "/favicon.png?v=2",
    shortcut: "/favicon.png?v=2",
    apple: "/apple-icon.png?v=4",
  },
  verification: {
    other: {
      "facebook-domain-verification": "9s5h3gpy1dsug77z53xlhpvjpr3s89",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <SmoothScroll>
          <GSAPProvider>
            <AgeGate />
            <ScrollToTop />
            <Header />
            {children}
            <Footer />
          </GSAPProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
