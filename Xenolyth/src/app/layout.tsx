import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import LogoReveal from "@/components/ui/LogoReveal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://xenolyth.vercel.app'),
  title: {
    default: "Xenolyth | Autonomous AI Systems",
    template: "%s | Xenolyth"
  },
  description: "Xenolyth builds autonomous AI products that operate independently, reliably, and at scale — starting with Sentinel.",
  keywords: ["autonomous AI", "Sentinel", "AI operations", "autonomous systems", "Xenolyth", "operational software"],
  authors: [{ name: "Xenolyth" }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true }
  },
  openGraph: {
    title: "Xenolyth | Autonomous AI Systems",
    description: "Xenolyth builds autonomous AI products that operate independently, reliably, and at scale — starting with Sentinel.",
    url: "https://xenolyth.vercel.app",
    siteName: "Xenolyth",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-preview.png",
        width: 1200,
        height: 630,
        alt: "Xenolyth — Autonomous Systems for Complex Problems",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Xenolyth | Autonomous AI Systems",
    description: "Xenolyth builds autonomous AI products that operate independently, reliably, and at scale — starting with Sentinel.",
    images: ["/images/og-preview.png"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-theme="dark"
    >
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <AuthProvider>
          <LogoReveal />
          <Navbar />
          <main className="grow flex flex-col">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
