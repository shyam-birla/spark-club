'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';
import { navLinks } from '../constants/navLinks';

const NavMenu = ({ isMobile, setIsOpen }) => {
  const pathname = usePathname();
  return (
    <nav className={`font-medium ${isMobile ? 'flex flex-col items-center gap-6 py-8' : 'hidden md:flex items-center gap-6'}`}>
      {navLinks.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link key={link.label} href={link.href} onClick={() => isMobile && setIsOpen(false)} className={`transition-colors ${isActive ? 'text-black' : 'text-gray-500 hover:text-black'}`} aria-current={isActive ? 'page' : undefined}>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};

const AuthButtons = ({ session, profileImageUrl, isMobile }) => (
  <div className={`${isMobile ? 'flex flex-col items-center gap-4 mt-6' : 'hidden md:flex items-center gap-4'}`}>
    {!session?.user ? (
      <button onClick={() => signIn()} className="bg-black text-white px-5 py-2 rounded-md font-bold hover:opacity-80 transition-opacity">
        Login
      </button>
    ) : (
      <>
        <Link href="/profile" className="flex items-center gap-2 group cursor-pointer">
          {profileImageUrl && (
            <Image src={profileImageUrl} alt={session.user.name} width={isMobile ? 32 : 40} height={isMobile ? 32 : 40} className="rounded-full" />
          )}
          <span className={`font-semibold ${isMobile ? '' : 'text-sm group-hover:text-orange-600 transition-colors'}`}>
            Hi, {session.user.name.split(' ')[0]}
          </span>
        </Link>
        <button onClick={() => signOut()} className="bg-gray-200 text-black px-4 py-2 rounded-md font-bold text-sm hover:bg-gray-300 transition-colors">
          Logout
        </button>
      </>
    )}
  </div>
);

export default function NavBarClient({ session, profileImageUrl }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => window.removeEventListener('scroll', controlNavbar);
    }
  }, [controlNavbar]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 border-b transition-all duration-300 ${
        (isVisible || isOpen) ? 'translate-y-0' : '-translate-y-full'
      } bg-gray-100/80 backdrop-blur-md border-gray-200 shadow-sm`}
    >
      <Link href="/">
        <Image src="/logo-black.png" alt="SPARK! Club Logo" width={40} height={40} className="object-contain" priority={true} />
      </Link>

      <NavMenu />

      <AuthButtons session={session} profileImageUrl={profileImageUrl} />

      <div className="md:hidden text-black">
        <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu" aria-expanded={isOpen}>
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 max-h-screen overflow-y-auto">
          <NavMenu isMobile setIsOpen={setIsOpen} />
          <AuthButtons session={session} profileImageUrl={profileImageUrl} isMobile />
        </div>
      )}
    </header>
  );
}
