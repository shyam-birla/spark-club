import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer"; // Footer ko import karein

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SPARK Club - Igniting Innovation",
  description: "The official website of the SPARK tech club, a community for builders, innovators, and learners.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* // YEH STRUCTURE BAHUT ZAROORI HAI */}
      <body className={`${inter.className} bg-black text-gray-200`}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer /> {/* // Footer ko yahan add karein */}
        </div>
      </body>
    </html>
  );
}