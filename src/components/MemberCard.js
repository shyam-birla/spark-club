import Link from 'next/link';
import Image from 'next/image';
import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';

const MemberCard = ({ member }) => {
  return (
    // Card ko light theme ke liye update kiya
    <div className="bg-white rounded-lg text-center transition-all duration-300 shadow-md hover:shadow-xl border border-gray-200">
      <Link href={`/members/${member.slug}`}>
        <div className="relative w-full h-60">
          {/* Image component ko naye syntax ke hisaab se update kiya */}
          <Image
            src={member.imageUrl || '/placeholder.png'}
            alt={member.name}
            fill
            className="object-cover rounded-t-lg"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/members/${member.slug}`}>
          <h3 className="text-xl font-bold text-black">{member.name}</h3>
          {/* Role ka color orange se dark grey kiya */}
          <p className="text-gray-600">{member.role}</p>
        </Link>
        
        {/* Naya Feature: Social Media Icons */}
        <div className="flex justify-center gap-4 mt-4">
          {member.linkedinUrl && (
            <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black">
              <FaLinkedin size={24} />
            </a>
          )}
          {member.githubUrl && (
            <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black">
              <FaGithub size={24} />
            </a>
          )}
          {member.instagramUrl && (
            <a href={member.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black">
              <FaInstagram size={24} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberCard;