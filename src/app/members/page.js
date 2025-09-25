import { client } from '../../../sanity/lib/client';
import MemberCard from '@/components/MemberCard';

// === QUERY YAHAN THEEK KI GAYI HAI ===
// Naye social media fields add kiye gaye hain
const membersQuery = `*[_type == "member"]{
  _id,
  name,
  role,
  "imageUrl": image.asset->url,
  "slug": slug.current,
  linkedinUrl,
  githubUrl,
  instagramUrl
}`;

export default async function MembersPage() {
  const members = await client.fetch(membersQuery);

  return (
    <main className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-2 text-black">Our Team</h1>
      {/* Subtitle ka color bhi theek kar diya hai */}
      <p className="text-gray-600 mb-12">The minds behind the innovation.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {members.map((member) => (
          <MemberCard key={member._id} member={member} />
        ))}
      </div>
    </main>
  );
}