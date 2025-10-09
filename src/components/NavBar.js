'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = useCallback(() => {
    if (typeof window !== 'undefined') {
      // Logic to hide navbar on scroll down and show on scroll up
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
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [controlNavbar]);

  useEffect(() => {
    // Logic to prevent background scroll when mobile menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const navLinks = [
    { href: "/projects", label: "Projects" },
    { href: "/resources", label: "Resources" },
    { href: "/events", label: "Events" },
    { href: "/research", label: "Research" },
    { href: "/about", label: "About" },
    { href: "/members", label: "Members" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 border-b transition-all duration-300 ${
        (isVisible || isOpen) ? 'translate-y-0' : '-translate-y-full'
      } bg-gray-100/80 backdrop-blur-md border-gray-200 shadow-sm`}
    >
      <Link href="/">
        <Image src="/logo-black.png" alt="SPARK! Club Logo" width={120} height={40} className="object-contain" />
      </Link>

      <nav className="hidden md:flex items-center gap-6 font-medium">
        {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
                <Link key={link.label} href={link.href} className={`transition-colors ${isActive ? 'text-black' : 'text-gray-500 hover:text-black'}`}>{link.label}</Link>
            )
        })}
      </nav>

      <div className="hidden md:flex items-center gap-4">
        {status === 'loading' && (
          <div className="bg-gray-200 h-10 w-24 rounded-md animate-pulse"></div>
        )}

        {status === 'unauthenticated' && (
          <button onClick={() => signIn()} className="bg-black text-white px-5 py-2 rounded-md font-bold hover:opacity-80 transition-opacity">
            Login
          </button>
        )}

        {status === 'authenticated' && (
          <>
            <Link href="/profile" className="flex items-center gap-2 group cursor-pointer">
              {session.user.image && (
                <Image src={session.user.image} alt={session.user.name} width={40} height={40} className="rounded-full" />
              )}
              <span className="font-semibold text-sm group-hover:text-orange-600 transition-colors">
                Hi, {session.user.name.split(' ')[0]}
              </span>
            </Link>
            <button onClick={() => signOut()} className="bg-gray-200 text-black px-4 py-2 rounded-md font-bold text-sm hover:bg-gray-300 transition-colors">
              Logout
            </button>
          </>
        )}
      </div>

      <div className="md:hidden text-black">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> ) : ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg> )}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 h-screen overflow-y-auto">
           <nav className="flex flex-col items-center gap-6 font-medium py-8">
            {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (<Link key={link.label} href={link.href} className={`transition-colors ${isActive ? 'text-black' : 'text-gray-500 hover:text-black'}`}>{link.label}</Link>)
            })}
            
            <div className="mt-6">
              {status === 'unauthenticated' && (
                <button onClick={() => signIn()} className="bg-black text-white px-5 py-2 rounded-md font-bold hover:opacity-80 transition-opacity">
                  Login
                </button>
              )}
              {status === 'authenticated' && (
                <div className="flex flex-col items-center gap-4">
                  <Link href="/profile" className="flex items-center gap-2">
                    {session.user.image && (<Image src={session.user.image} alt={session.user.name} width={32} height={32} className="rounded-full" />)}
                    <span className="font-semibold">Hi, {session.user.name.split(' ')[0]}</span>
                  </Link>
                  <button onClick={() => signOut()} className="bg-gray-200 text-black px-4 py-2 rounded-md font-bold text-sm hover:bg-gray-300 transition-colors">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
export default NavBar;