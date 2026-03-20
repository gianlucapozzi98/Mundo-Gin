import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
  title: "Mundo Gin | Premium Italian Gin",
  description:
    "Scopri Mundo Gin - il gin che racconta il mondo. Premium Italian Gin.",
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
