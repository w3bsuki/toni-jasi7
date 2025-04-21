import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { CartProvider } from "@/hooks/useCart";
import { ClientInitScript } from "@/components/ClientInitScript";
import { Suspense } from "react";
import { Analytics } from "@/components/analytics";

// Preload and optimize font loading
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Hat Store | Premium Headwear Collection",
  description: "Shop our exclusive collection of premium hats for all styles and occasions.",
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#000000',
  authors: [{ name: 'Hat Store Team' }],
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "Hat Store | Premium Headwear Collection",
    description: "Shop our exclusive collection of premium hats for all styles and occasions.",
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <ClientInitScript />
            {/* Use Suspense boundaries for better loading experience */}
            <Suspense fallback={<div className="fixed top-0 w-full h-2 bg-primary/30 animate-pulse"></div>}>
              <Header />
            </Suspense>
            
            <main className="flex-1">
              {/* Content wrapped in Suspense for better loading */}
              <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}>
                {children}
              </Suspense>
            </main>
            
            <Suspense fallback={null}>
              <Footer />
            </Suspense>
            
            <Toaster />
            
            {/* Performance monitoring */}
            <Analytics />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
