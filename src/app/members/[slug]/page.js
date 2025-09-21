import { client } from '../../../../sanity/lib/client';
// Image component ko hata diya gaya hai
import Link from 'next/link';

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
    <main className="container mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-48 h-48 rounded-full overflow-hidden flex-shrink-0">
          {member.imageUrl && (
            // YAHAN BADLAV KIYA GAYA HAI:
            // Normal <img> tag use kiya gaya hai
            <img
              src={member.imageUrl}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-bold">{member.name}</h1>
          <p className="text-2xl text-orange-400 mt-2">{member.role}</p>
          <div className="flex justify-center md:justify-start gap-4 mt-4">
            {member.linkedinUrl && (
              <Link href={member.linkedinUrl} target="_blank">
                <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md">LinkedIn</button>
              </Link>
            )}
            {member.githubUrl && (
              <Link href={member.githubUrl} target="_blank">
                <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md">GitHub</button>
              </Link>
            )}
          </div>
        </div>
      </div>
      {member.bio && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">About</h2>
          <p className="text-gray-300 leading-relaxed">{member.bio}</p>
        </div>
      )}
    </main>
  );
}