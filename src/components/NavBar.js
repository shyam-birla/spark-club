'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center p-4 bg-black/80 backdrop-blur-lg border-b border-gray-800 text-white">
      {/* Logo */}
      <Link href="/">
        {/* Make sure your white logo is in public/logo-white.png */}
        <Image src="/logo-white.png" alt="SPARK! Club Logo" width={120} height={40} className="object-contain" />
      </Link>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-gray-200 font-medium">
        <Link href="/projects" className="hover:text-white transition-colors">Projects</Link>
        <Link href="/resources" className="hover:text-white transition-colors">Resources</Link>
        <Link href="/events" className="hover:text-white transition-colors">Events</Link>
        <Link href="/about" className="hover:text-white transition-colors">About</Link>
        <Link href="/members" className="hover:text-white transition-colors">Members</Link>
        <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
        <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
      </nav>

      {/* Member Button */}
      <div className="hidden md:block">
        <Link href="/join">
          <button className="bg-orange-500 text-white px-5 py-2 rounded-md font-bold hover:bg-orange-600 transition-colors">
            Become a Member
          </button>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-black">
          <nav className="flex flex-col items-center gap-6 text-gray-200 font-medium py-4">
            <Link href="/projects" className="hover:text-white transition-colors">Projects</Link>
            <Link href="/resources" className="hover:text-white transition-colors">Resources</Link>
            <Link href="/events" className="hover:text-white transition-colors">Events</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/members" className="hover:text-white transition-colors">Members</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/join">
              <button className="bg-orange-500 text-white px-5 py-2 rounded-md font-bold hover:bg-orange-600 transition-colors">
                Become a Member
              </button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;