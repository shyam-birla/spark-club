import { client } from '../../../sanity/lib/client';
import ProjectListClient from '@/components/ProjectListClient'; // Import the new client component

const projectsQuery = `*[_type == "project" && approvalStatus == "published"] | order(displayOrder asc) {
  _id,
  title,
  "slug": slug.current,
  description,
  "cardImageUrl": cardImage.asset->url,
  tags,
  status,
  _createdAt // Add _createdAt for sorting
}`;

export default async function ProjectsPage() {
  const projects = await client.fetch(projectsQuery, {}, { cache: 'no-store' });

  return (
    <ProjectListClient initialProjects={projects} />
  );
}
