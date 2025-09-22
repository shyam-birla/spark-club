import { client } from '../../../../sanity/lib/client';
import Image from 'next/image';
import Link from 'next/link';
import PortableTextComponent from '@/components/PortableTextComponent';

const memberQuery = `*[_type == "member" && slug.current == $slug][0]{
  _id, name, role, "imageUrl": image.asset->url, linkedinUrl, githubUrl, bio
}`;

export default async function MemberDetailPage({ params }) {
  const { slug } = params;
  const member = await client.fetch(memberQuery, { slug });

  if (!member) {
    return <div>Member not found.</div>;
  }

  return (
    <main className="bg-black container mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-48 h-48 rounded-full overflow-hidden flex-shrink-0">
          {member.imageUrl && (
            <Image
              src={member.imageUrl}
              alt={member.name}
              layout="fill"
              objectFit="cover"
            />
          )}
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-bold text-white">{member.name}</h1>
          <p className="text-2xl text-orange-400 mt-2">{member.role}</p>
          <div className="flex justify-center md:justify-start gap-4 mt-4">
            {member.linkedinUrl && (
              <Link href={member.linkedinUrl} target="_blank">
                <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-white">LinkedIn</button>
              </Link>
            )}
            {member.githubUrl && (
              <Link href={member.githubUrl} target="_blank">
                <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-white">GitHub</button>
              </Link>
            )}
          </div>
        </div>
      </div>
      {member.bio && (
        <div className="mt-12 prose prose-invert max-w-none text-gray-300 leading-relaxed">
          <h2 className="text-2xl font-bold mb-4 text-white">About</h2>
          <PortableTextComponent value={member.bio} />
        </div>
      )}
    </main>
  );
}