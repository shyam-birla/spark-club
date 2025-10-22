import Link from 'next/link';
import Image from 'next/image';
import { FaLinkedin, FaGithub, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { client } from '../../sanity/lib/client';
import { navLinks } from '../constants/navLinks';

const socialIconMap = {
  linkedin: FaLinkedin,
  github: FaGithub,
  instagram: FaInstagram,
  whatsapp: FaWhatsapp
};

const fetchedSocialLinks = await client.fetch('*[_type == "socialLink"]');
  const socialLinks = fetchedSocialLinks || []; // Ensure it's an array

  return (
    <footer className="bg-gray-100/50 backdrop-blur-sm text-gray-600 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">
          
          <div className="flex flex-col items-center md:items-start md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image src="/logo-black.png" alt="SPARK Community Logo" width={50} height={50} />
              <span className="text-xl font-bold text-black">SPARK Community</span>
            </Link>
            <p className="text-sm max-w-md">
              Society of Programmers, Aspiring Research and Knowledge (SPARK). Igniting the future of technology, one project at a time.
            </p>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-10">
            <div>
              <h3 className="text-black font-semibold mb-4 tracking-wider uppercase">Quick Links</h3>
              <ul className="grid grid-cols-2 gap-2">
                {navLinks.map(link => (
                  <li key={link.href}><Link href={link.href} className="hover:text-black">{link.label}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-black font-semibold mb-4 tracking-wider uppercase">Connect</h3>
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                {socialLinks.map((link) => {
                  if (!link) return null; // Add null check for link
                  const Icon = socialIconMap[link.icon];
                  return (
                    <a key={link._id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black transition-colors text-2xl">
                      {Icon && <Icon />}
                    </a>
                  );
                })}
              </div>
              <a href="mailto:spark.community.contact@gmail.com" className="hover:text-black transition-colors font-semibold">
                spark.community.contact@gmail.com
              </a>
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
      
      <div className="bg-gray-200/50 backdrop-blur-sm py-4">
        <div className="container mx-auto px-6 text-center text-sm text-gray-700 sm:flex sm:justify-between">
          <span>&copy; {new Date().getFullYear()} SPARK Community. All Rights Reserved.</span>
          <span className="mt-2 sm:mt-0 block">
            <Link href="/privacy-policy" className="hover:text-black">Privacy Policy</Link>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
