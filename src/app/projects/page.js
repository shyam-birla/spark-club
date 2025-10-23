import { client } from '../../../sanity/lib/client';
import { FaCodeBranch } from 'react-icons/fa';
import ProjectCard from '@/components/ProjectCard';

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
    <main className="bg-gray-50/50 backdrop-blur-sm py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-black text-center flex items-center justify-center gap-3"><FaCodeBranch className="text-green-500" /> Projects</h1>
        <p className="text-gray-600 mb-12 text-center">Explore our ongoing and past projects.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-8">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </div>
    </main>
  );
}
