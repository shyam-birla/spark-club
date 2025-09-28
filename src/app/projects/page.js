// src/app/projects/page.js
import FeaturedProjects from '@/components/FeaturedProjects';
import { client } from '../../../sanity/lib/client';

// --- YAHAN QUERY UPDATE KI GAYI HAI ---
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
    <main className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-8 text-black">Projects</h1>
      <p className="text-gray-600 mb-12">Explore our ongoing and past projects.</p>
      
      {/* Yeh component ab aapke naye order mein projects dikhayega */}
      <FeaturedProjects projects={projects} />
    </main>
  );
}
