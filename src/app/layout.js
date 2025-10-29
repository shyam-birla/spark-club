import { Space_Grotesk } from 'next/font/google';
import "./globals.css";
import Navbar from "@/components/NavBar";
import { Toaster } from 'react-hot-toast'; // Import Toaster
// Footer yahan se hata diya gaya hai
import DynamicGlobal3DCanvas from '@/components/DynamicGlobal3DCanvas';
import NextAuthProvider from '@/components/NextAuthProvider';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import ProfileChecker from '@/components/ProfileChecker';
// import { Metadata } from 'next'; // Metadata type import hata diya gaya (JS mein zaroorat nahi)

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

// Metadata object ko update kiya gaya hai (TypeScript type hata diya gaya)
export const metadata = {
  title: "SPARK Community",
  description: "The official website of the SPARK tech club, a community for builders, innovators, and learners.",

};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

// socialLinksQuery ko yahan se hata diya gaya hai

// Function signature se TypeScript type annotation hata di gayi
export default async function RootLayout({ children }) {
  // socialLinks ka data fetching yahan se hata diya gaya hai

  return (
    <html lang="en" className={spaceGrotesk.className}>
      <body className={`bg-white text-gray-700`}>
        <NextAuthProvider>
          <DynamicGlobal3DCanvas />

          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-16 bg-white/80 backdrop-blur-sm">
              <ProfileChecker>{children}</ProfileChecker>
            </main>

            {/* Footer component ko yahan se hata diya gaya hai */}
          </div>
        </NextAuthProvider>
        <Analytics />
        <SpeedInsights />
        <Toaster />
      </body>
    </html>
  );
}
