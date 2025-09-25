import { client } from '../../../../sanity/lib/client';
import Image from 'next/image';
import Link from 'next/link';
import PortableTextComponent from '@/components/PortableTextComponent';
import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa'; // Icons ko import kiya

// Naya Function: Yeh Next.js ko batata hai ki kaun kaun se member pages hain
export async function generateStaticParams() {
  const slugs = await client.fetch(`*[_type == "member" && defined(slug.current)]{ "slug": slug.current }`);
  return slugs;
}

// Query ko update karke instagramUrl add kiya
const memberQuery = `*[_type == "member" && slug.current == $slug][0]{
  _id, name, role, "imageUrl": image.asset->url, linkedinUrl, githubUrl, instagramUrl, bio
}`;

export default async function MemberDetailPage({ params }) {
  const { slug } = await Promise.resolve(params);
  const member = await client.fetch(memberQuery, { slug });

  if (!member) {
    return <div>Member not found.</div>;
  }

  return (
    <main className="bg-white container mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-48 h-48 rounded-full overflow-hidden flex-shrink-0">
          {member.imageUrl && (
            <Image
              src={member.imageUrl}
              alt={member.name}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-bold text-black">{member.name}</h1>
          <p className="text-2xl text-gray-600 mt-2">{member.role}</p>
          
          {/* === BUTTONS KI JAGAH ICONS ADD KIYE GAYE HAIN === */}
          <div className="flex justify-center md:justify-start gap-6 mt-4">
            {member.linkedinUrl && (
              <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black transition-colors">
                <FaLinkedin size={28} />
              </a>
            )}
            {member.githubUrl && (
              <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black transition-colors">
                <FaGithub size={28} />
              </a>
            )}
            {member.instagramUrl && (
                <a href={member.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black transition-colors">
                    <FaInstagram size={28} />
                </a>
            )}
          </div>
        </div>
      </div>
      {member.bio && (
        <div className="mt-12 prose max-w-none text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-bold mb-4 text-black">About</h2>
          <PortableTextComponent value={member.bio} />
        </div>
      )}
    </main>
  );
}