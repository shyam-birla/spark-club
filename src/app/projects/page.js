import FeaturedProjects from '@/components/FeaturedProjects';
import { client } from '../../../sanity/lib/client';

const projectsQuery = `*[_type == "project"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  description,
  "imageUrl": image.asset->url,
  tags
}`;

export default async function ProjectsPage() {
  const projects = await client.fetch(projectsQuery);

  return (
    <main className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-8">Projects</h1>
      <p className="text-gray-400 mb-12">Explore our ongoing and past projects.</p>
      <FeaturedProjects projects={projects} />
    </main>
  );
}
