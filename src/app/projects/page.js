import { client } from '../../../sanity/lib/client';
import { FaCodeBranch } from 'react-icons/fa';
import ProjectCard from '@/components/ProjectCard';

const projectsQuery = `*[_type == "project"] | order(displayOrder asc) {
  _id,
  title,
  "slug": slug.current,
  description,
  "cardImageUrl": cardImage.asset->url,
  tags,
  status
}`;
export default async function ProjectsPage() {
  const projects = await client.fetch(projectsQuery, {}, { cache: 'no-store' });

  const upcomingProjects = projects.filter(project => project.status === 'upcoming');
  const inProgressProjects = projects.filter(project => project.status === 'in-progress');
  const completedProjects = projects.filter(project => project.status === 'completed');

  const renderProjectSection = (title, projectsList, placeholderMessage) => (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-black mb-6 border-b-2 border-green-500 pb-2">{title}</h2>
      {projectsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {projectsList.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center py-8 bg-white rounded-lg shadow-sm">{placeholderMessage}</p>
      )}
    </section>
  );

  return (
    <main className="bg-gray-50/50 backdrop-blur-sm py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-black text-center flex items-center justify-center gap-3"><FaCodeBranch className="text-green-500" /> Projects</h1>
        <p className="text-gray-600 mb-12 text-center">Explore our ongoing and past projects.</p>
        
        {renderProjectSection(
          'Upcoming Projects',
          upcomingProjects,
          'No upcoming projects at the moment. Stay tuned for exciting new initiatives!'
        )}

        {renderProjectSection(
          'In Progress Projects',
          inProgressProjects,
          'No projects currently in progress. Check back later for updates!'
        )}

        {renderProjectSection(
          'Completed Projects',
          completedProjects,
          'No completed projects yet. Be the first to finish one!'
        )}

        {renderProjectSection(
          'Archived Projects',
          projects.filter(project => project.status === 'archived'),
          'No archived projects found.'
        )}
      </div>
    </main>
  );
}
