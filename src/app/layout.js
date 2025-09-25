import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer"; // Footer ko import karein
import { client } from "../../sanity/lib/client";

const inter = Inter({ subsets: ["latin"] });

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
  let socialLinks = []; // Default to empty array
  try {
    socialLinks = await client.fetch(socialLinksQuery);
  } catch (error) {
    console.error("Failed to fetch social links:", error);
    // If fetching fails, the footer will simply not render the links.
  }

  return (
    <html lang="en">
      {/* // YEH STRUCTURE BAHUT ZAROORI HAI */}
      <body className={`${inter.className} bg-black text-gray-200`}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer socialLinks={socialLinks} /> {/* // Footer ko yahan add karein */}
        </div>
      </body>
    </html>
  );
}