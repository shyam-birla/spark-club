import { Space_Grotesk } from 'next/font/google';
import "./globals.css";
import Navbar from "@/components/NavBar";
// Footer yahan se hata diya gaya hai
import Global3DCanvas from '@/components/Global3DCanvas';
import NextAuthProvider from '@/components/NextAuthProvider';

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata = {
  title: "SPARK Club - Igniting Innovation",
  description: "The official website of the SPARK tech club, a community for builders, innovators, and learners.",
};

// socialLinksQuery ko yahan se hata diya gaya hai

export default async function RootLayout({ children }) {
  // socialLinks ka data fetching yahan se hata diya gaya hai

  return (
    <html lang="en" className={spaceGrotesk.className}>
      <body className={`bg-white text-gray-700`}>
        <NextAuthProvider> 
          <Global3DCanvas />
          
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            
            <main className="flex-grow pt-20">
              {children}
            </main>

            {/* Footer component ko yahan se hata diya gaya hai */}
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}