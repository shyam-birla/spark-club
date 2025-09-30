import FeaturedProjects from '@/components/FeaturedProjects';
import { client } from '../../../sanity/lib/client';

const projectsQuery = `*[_type == "project"] | order(displayOrder asc) {
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
    // === YAHAN BADLAV KIYA GAYA HAI ===
    <main className="bg-gray-50/50 backdrop-blur-sm py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-black text-center">Projects</h1>
        <p className="text-gray-600 mb-12 text-center">Explore our ongoing and past projects.</p>
        
        <FeaturedProjects projects={projects} />
      </div>
    </main>
  );
}
