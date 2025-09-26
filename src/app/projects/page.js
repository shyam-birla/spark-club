import FeaturedProjects from '@/components/FeaturedProjects';
import { client } from '../../../sanity/lib/client';

const projectsQuery = `*[_type == "project"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  description,
  "cardImageUrl": cardImage.asset->url,
  tags
}`;

export default async function ProjectsPage() {
  const projects = await client.fetch(projectsQuery, {}, { cache: 'no-store' });

  return (
    <main className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-8 text-black">Projects</h1>
      {/* Paragraph text ko dark grey kiya */}
      <p className="text-gray-600 mb-12">Explore our ongoing and past projects.</p>
      
      {/* Yeh component pehle se hi styled hai! */}
      <FeaturedProjects projects={projects} />
    </main>
  );
}