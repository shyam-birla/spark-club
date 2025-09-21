import Image from 'next/image';
import Link from 'next/link';

const NavBar = () => {
  return (
    <header className="sticky top-0 z-50 flex justify-between items-center p-4 bg-black text-white">
      {/* Logo */}
      <Link href="/">
        {/* Make sure your white logo is in public/logo-white.png */}
        <Image src="/logo-white.png" alt="SPARK! Club Logo" width={120} height={40} className="object-contain" />
      </Link>

      {/* Navigation Links with improved contrast */}
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
      <Link href="/join">
        <button className="bg-orange-500 text-white px-5 py-2 rounded-md font-bold hover:bg-orange-600 transition-colors">
          Become a Member
        </button>
      </Link>
    </header>
  );
};

export default NavBar;