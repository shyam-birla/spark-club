import Link from 'next/link';
import Image from 'next/image';
import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';

const MemberCard = ({ member }) => {
  return (
    // Card ko light theme ke liye update kiya
    <div className="bg-white rounded-lg text-center transition-all duration-300 shadow-md hover:shadow-xl border border-gray-200">
      <Link href={`/members/${member.slug}`}>
        <div className="relative w-full h-40 sm:h-48">
          {/* Image component ko naye syntax ke hisaab se update kiya */}
          <Image
            src={member.imageUrl || '/placeholder.png'}
            alt={member.name}
            fill
            className="object-cover rounded-t-lg"
          />
        </div>
      </Link>
      <div className="p-1 sm:p-2">
        <Link href={`/members/${member.slug}`}>
          <h3 className="text-base sm:text-lg font-bold text-black">{member.name}</h3>
          {/* Role ka color orange se dark grey kiya */}
          <p className="text-xs sm:text-sm text-gray-600">{member.role}</p>
        </Link>
        
        {/* Naya Feature: Social Media Icons */}
        <div className="flex justify-center gap-2 mt-1 sm:gap-3 sm:mt-2">
          {member.linkedinUrl && (
            <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black">
              <FaLinkedin size={16} className="sm:w-5 sm:h-5" />
            </a>
          )}
          {member.githubUrl && (
            <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black">
              <FaGithub size={16} className="sm:w-5 sm:h-5" />
            </a>
          )}
          {member.instagramUrl && (
            <a href={member.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black">
              <FaInstagram size={16} className="sm:w-5 sm:h-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberCard;