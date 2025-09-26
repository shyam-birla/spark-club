import { Space_Grotesk } from 'next/font/google';
import "./globals.css";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { client } from "../../sanity/lib/client";
import Global3DCanvas from '@/components/Global3DCanvas';

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata = {
  title: "SPARK Club - Igniting Innovation",
  description: "The official website of the SPARK tech club, a community for builders, innovators, and learners.",
};

const socialLinksQuery = `*[_type == "socialLink"]{
  _id,
  name,
  url,
  icon
}`;

export default async function RootLayout({ children }) {
  let socialLinks = [];
  try {
    socialLinks = await client.fetch(socialLinksQuery);
  } catch (error) {
    console.error("Failed to fetch social links:", error);
  }

  return (
    <html lang="en" className={spaceGrotesk.className}>
      <body className={`bg-white text-gray-700`}>
        <Global3DCanvas />
        
        {/* This div ensures all content is stacked above the 3D canvas */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer socialLinks={socialLinks} />
        </div>
      </body>
    </html>
  );
}