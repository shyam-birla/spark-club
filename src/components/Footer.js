import Link from 'next/link';
import Image from 'next/image';

const Footer = ({ socialLinks = [] }) => {
  return (
    // === YAHAN BADLAV KIYA GAYA HAI ===
    // Footer ke background ko 50% transparent aur blurred kiya gaya hai
    <footer className="bg-gray-100/50 backdrop-blur-sm text-gray-600 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">
          
          <div className="flex flex-col items-center md:items-start md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image src="/logo-black.png" alt="SPARK Club Logo" width={50} height={50} />
              <span className="text-xl font-bold text-black">SPARK Club</span>
            </Link>
            <p className="text-sm max-w-md">
              Society of Programmers, Aspiring Research and Knowledge (SPARK). Igniting the future of technology, one project at a time.
            </p>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-10">
            <div>
              <h3 className="text-black font-semibold mb-4 tracking-wider uppercase">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/projects" className="hover:text-black">Projects</Link></li>
                <li><Link href="/events" className="hover:text-black">Events</Link></li>
                <li><Link href="/blog" className="hover:text-black">Blog</Link></li>
                <li><Link href="/resources" className="hover:text-black">Resources</Link></li>
                <li><Link href="/contact" className="hover:text-black">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-black font-semibold mb-4 tracking-wider uppercase">Connect</h3>
              <ul className="space-y-2">
                {socialLinks.map((link) => (
                  <li key={link._id}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
                <li><a href="mailto:sparkclub.sati@gmail.com" className="hover:text-black transition-colors font-semibold">
                  sparkclub.sati@gmail.com
                </a></li>
              </ul>
              <div className="mt-6">
                <Link href="/join">
                  <button className="bg-black text-white px-5 py-2 rounded-md font-semibold hover:opacity-80 transition-opacity w-full md:w-auto">
                    Become a Member
                  </button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* === YAHAN BHI BADLAV KIYA GAYA HAI === */}
      {/* Bottom Bar ke background ko bhi 50% transparent aur blurred kiya gaya hai */}
      <div className="bg-gray-200/50 backdrop-blur-sm py-4">
        <div className="container mx-auto px-6 text-center text-sm text-gray-700 sm:flex sm:justify-between">
          <span>&copy; {new Date().getFullYear()} SPARK Club SATI. All Rights Reserved.</span>
          <span className="mt-2 sm:mt-0 block">
            <Link href="/privacy-policy" className="hover:text-black">Privacy Policy</Link>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;