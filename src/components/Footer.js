import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">
          
          {/* Column 1: Club Identity & Mission ✨ */}
          <div className="flex flex-col items-center md:items-start md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image src="/logo-white.png" alt="SPARK Club Logo" width={50} height={50} />
              <span className="text-xl font-bold text-white">SPARK Club</span>
            </Link>
            <p className="text-sm max-w-md">
              Society of Programmers, Aspiring Research and Knowledge (SPARK). Igniting the future of technology, one project at a time.
            </p>
          </div>

          {/* Column 2: Quick Links 🧭 */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wider uppercase">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-orange-400 transition-colors">About</Link></li>
              <li><Link href="/projects" className="hover:text-orange-400 transition-colors">Projects</Link></li>
              <li><Link href="/events" className="hover:text-orange-400 transition-colors">Events</Link></li>
              <li><Link href="/contact" className="hover:text-orange-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Connect & CTA 🤝 */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wider uppercase">Connect</h3>
            <ul className="space-y-2">
              <li><a href="https://chat.whatsapp.com/Gl8jd4Xz0jKAd9QUCDIVQ9" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">WhatsApp</a></li>
              <li><a href="https://www.instagram.com/spark_club_sati?igsh=MXhncDJmZ2t4Mmg0MA==" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">Instagram</a></li>
              <li><a href="mailto:sparkclub.sati@gmail.com" className="hover:text-orange-400 transition-colors font-semibold">
                  sparkclub.sati@gmail.com
              </a></li>
            </ul>
            <div className="mt-6">
              <Link href="/join">
                <button className="bg-orange-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-orange-600 transition-colors w-full md:w-auto">
                  Become a Member
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
      
      {/* Bottom Bar with Copyright & Privacy Policy */}
      <div className="bg-black py-4">
        <div className="container mx-auto px-6 text-center text-sm sm:flex sm:justify-between">
          <span>&copy; {new Date().getFullYear()} SPARK Club SATI. All Rights Reserved.</span>
          <span className="mt-2 sm:mt-0 block">
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;