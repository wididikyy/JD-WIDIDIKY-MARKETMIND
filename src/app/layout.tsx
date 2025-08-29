import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Market Mind | Prediksi Harga Komoditas Berbasis AI",
  description:
    "Market Mind adalah aplikasi cerdas berbasis AI untuk memantau, membandingkan, dan memprediksi harga komoditas pangan & UMKM di Banyuwangi secara real-time.",
  keywords: [
    "harga komoditas",
    "prediksi harga",
    "AI pertanian",
    "harga cabai",
    "harga tomat",
    "harga pangan Banyuwangi",
    "UMKM Banyuwangi",
  ],
  authors: [{ name: "Market Mind Team" }],
  metadataBase: new URL("https://marketmind.id"),
  openGraph: {
    title: "Market Mind | Prediksi Harga Komoditas Berbasis AI",
    description: "Bantu petani & UMKM mengambil keputusan lebih cerdas dengan prediksi harga real-time berbasis AI Gemini.",
    url: "https://marketmind.id",
    siteName: "Market Mind",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Market Mind - AI Harga Komoditas",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-[100dvh] flex-col">
            <Navbar />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
