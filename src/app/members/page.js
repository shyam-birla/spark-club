import { client } from '../../../sanity/lib/client';
import MemberCard from '@/components/MemberCard';

// Query waisi hi rahegi
const teamsQuery = `*[_type == "team"] | order(orderRank asc) {
  _id,
  title,
  "members": *[_type == "member" && references(^._id)] | order(orderRank asc) {
    _id,
    name,
    role,
    "imageUrl": image.asset->url,
    "slug": slug.current,
    linkedinUrl,
    githubUrl,
    instagramUrl
  }
}`;

export default async function MembersPage() {
  const teams = await client.fetch(teamsQuery);

  return (
    // === YAHAN BADLAV KIYA GAYA HAI ===
    // Background ko main tag par lagaya
    <main className="bg-gray-50/50 backdrop-blur-sm py-20">
        {/* Content ko center mein rakhne ke liye naya container div */}
        <div className="container mx-auto px-4">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-2 text-black">Our Team</h1>
                <p className="text-gray-600 mb-12">The minds behind the innovation.</p>
            </div>

            <div className="space-y-16">
                {teams.map((team) => (
                // Sirf unhi teams ko dikhayein jinke andar members hain
                team.members && team.members.length > 0 && (
                    <section key={team._id}>
                        {/* Team ka naam heading ki tarah dikhega */}
                        <h2 className="text-3xl font-bold mb-8 text-center">{team.title}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {/* Us team ke sabhi members yahan dikhenge */}
                            {team.members.map((member) => (
                                <MemberCard key={member._id} member={member} />
                            ))}
                        </div>
                    </section>
                )
                ))}
            </div>
        </div>
    </main>
  );
}