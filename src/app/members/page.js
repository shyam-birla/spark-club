import { client } from '../../../sanity/lib/client';
import MemberCard from '@/components/MemberCard';

// === NAYI AUR POWERFUL QUERY ===
// Pehle teams ko unke orderRank se sort karega,
// fir har team ke andar members ko unke orderRank se sort karega.
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
    <main className="container mx-auto px-4 py-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 text-black">Our Team</h1>
        <p className="text-gray-600 mb-12">The minds behind the innovation.</p>
      </div>

      {/* === NAYA LAYOUT: TEAMS KE HISAB SE GROUPING === */}
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
    </main>
  );
}