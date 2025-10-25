import Link from 'next/link';
import Image from 'next/image';
import { FaLinkedin, FaGithub, FaInstagram, FaWhatsapp, FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa';
import { client } from '../../sanity/lib/client';
import { navLinks } from '../constants/navLinks';

const socialIconMap = {
  linkedin: FaLinkedin,
  github: FaGithub,
  instagram: FaInstagram,
  whatsapp: FaWhatsapp,
  facebook: FaFacebook,
  twitter: FaTwitter,
  youtube: FaYoutube
};

const Footer = async () => {
  const fetchedSocialLinks = await client.fetch('*[_type == "socialLink"]');
  const socialLinks = fetchedSocialLinks || []; // Ensure it's an array

  return (
    <footer className="bg-gray-100/50 backdrop-blur-sm text-gray-600 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-6 py-4 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-10 text-center md:text-left">
          
          <div className="flex flex-col items-center md:items-start md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3 md:gap-3 md:mb-4">
              <Image src="/logo-black.png" alt="SPARK Community Logo" width={40} height={40} className="md:w-50 md:h-50" />
              <span className="text-lg font-bold text-black md:text-xl">SPARK Community</span>
            </Link>
            <p className="text-xs max-w-md md:text-sm">
              Society of Programmers, Aspiring Research and Knowledge (SPARK). Igniting the future of technology, one project at a time.
            </p>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
            <div>
              <h3 className="text-black font-semibold mb-3 tracking-wider uppercase text-sm md:text-base">Quick Links</h3>
              <ul className="grid grid-cols-2 gap-1 md:gap-2">
                {navLinks.map(link => (
                  <li key={link.href}><Link href={link.href} className="hover:text-black text-xs md:text-sm">{link.label}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-black font-semibold mb-3 tracking-wider uppercase text-sm md:text-base">Connect</h3>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3 md:gap-4 md:mb-4">
                {socialLinks.map((link) => {
                  if (!link) return null; // Add null check for link
                  const Icon = socialIconMap[link.icon];
                  return (
                    <a key={link._id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black transition-colors text-xl md:text-2xl">
                      {Icon && <Icon />}
                    </a>
                  );
                })}
              </div>
              <a href="mailto:spark.community.contact@gmail.com" className="hover:text-black transition-colors font-semibold text-xs md:text-base">
                spark.community.contact@gmail.com
              </a>
              <div className="mt-4 md:mt-6">
                <Link href="/join">
                  <button className="bg-black text-white px-4 py-1.5 rounded-md font-semibold hover:opacity-80 transition-opacity w-full text-sm md:w-auto md:px-5 md:py-2 md:text-base">
                    Become a Member
                  </button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      <div className="bg-gray-200/50 backdrop-blur-sm py-2">
        <div className="container mx-auto px-6 text-center text-xs text-gray-700 sm:flex sm:justify-between md:text-sm">
          <span>&copy; {new Date().getFullYear()} SPARK Community. All Rights Reserved.</span>
          <span className="mt-1 sm:mt-0 block">
            <Link href="/privacy-policy" className="hover:text-black">Privacy Policy</Link>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
