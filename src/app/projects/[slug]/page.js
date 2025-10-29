import { client } from '../../../../sanity/lib/client';
import Image from 'next/image';
import Link from 'next/link';
import PortableTextComponent from '@/components/PortableTextComponent';
import Breadcrumbs from '@/components/Breadcrumbs';
import ImageGalleryWithLightbox from '@/components/ImageGalleryWithLightbox'; // Import the gallery component
import { FaGithub, FaExternalLinkAlt, FaCheckCircle, FaHourglassHalf, FaCodeBranch, FaUsers, FaInfoCircle, FaCode, FaHome, FaProjectDiagram } from 'react-icons/fa';
import ShareButtons from '@/components/ShareButtons';
import ProjectCard from '@/components/ProjectCard';

// Yeh Next.js ko batata hai ki kaun kaun se project pages hain
export async function generateStaticParams() {
  const slugs = await client.fetch(`*[_type == "project" && defined(slug.current)]{ "slug": slug.current }`);
  return slugs;
}

const projectQuery = `*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  description,
  "mainImageUrl": mainImage.asset->url,
  "galleryImages": galleryImages[].asset->url,
  tags,
  githubUrl,
  liveUrl,
  status,
  technologies[]->{
    _id,
    name,
    "logoUrl": logo.asset->url
  },
  teamMembers[]{
    isTeamLead,
    projectRole,
    profileRef->{
      _id,
      name,
      "imageUrl": userImage.asset->url
    }
  },
  soloContributor{
    projectRole,
    profileRef->{
      _id,
      name,
      "imageUrl": userImage.asset->url
    }
  },
  projectType
}`;

const relatedProjectsQuery = `*[_type == "project" && _id != $currentProjectId && count(tags[@in $currentProjectTags]) > 0] | order(_createdAt desc) [0...3]{
  _id,
  title,
  "slug": slug.current,
  description,
  "cardImageUrl": cardImage.asset->url,
  tags,
  status
}`;

export default async function ProjectDetailPage({ params }) {
  const { slug } = await Promise.resolve(params);
  const project = await client.fetch(projectQuery, { slug });

  if (!project) {
    return <div>Project not found.</div>;
  }

  const relatedProjects = project.tags && project.tags.length > 0
    ? await client.fetch(relatedProjectsQuery, { currentProjectId: project._id, currentProjectTags: project.tags })
    : [];

  const breadcrumbs = [
    { label: 'Home', href: '/', icon: 'FaHome' },
    { label: 'Projects', href: '/projects', icon: 'FaProjectDiagram' },
    { label: project.title },
  ];

  return (
    <main className="bg-white/80 backdrop-blur-sm py-12 md:py-20">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbs} className="mb-4" />
            <div className="mb-8">
              <Link href="/projects">
                <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold text-sm hover:bg-gray-300 transition-colors flex items-center gap-2">
                  <FaHome /> Back to Projects
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              <aside className="lg:col-span-1 space-y-6 lg:sticky top-24 self-start">
                {project.mainImageUrl || (project.galleryImages && project.galleryImages.length > 0) ? (
                  <ImageGalleryWithLightbox
                    images={[
                      ...(project.mainImageUrl ? [{ src: project.mainImageUrl, alt: project.title }] : []),
                      ...(project.galleryImages ? project.galleryImages.map(url => ({ src: url, alt: project.title })) : []),
                    ]}
                  />
                ) : null}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 text-black flex items-center gap-2"><FaCodeBranch className="text-orange-500" /> Technologies Used</h3>
                    <div className="flex flex-wrap gap-3">
                      {project.technologies.map(tech => (
                        <div key={tech._id} className="flex items-center gap-2 bg-gray-100 p-2 pr-3 rounded-md border border-gray-200">
                          {tech.logoUrl && <Image src={tech.logoUrl} alt={tech.name} width={20} height={20} className="object-contain" />}
                          <span className="font-semibold text-sm">{tech.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {(project.projectType === 'team' && project.teamMembers && project.teamMembers.length > 0) && (
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 text-black flex items-center gap-2"><FaUsers className="text-blue-500" /> Meet the Team</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {project.teamMembers.map(member => (
                        <div key={member.profileRef._id} className="text-center">
                          {member.profileRef.imageUrl && <Image src={member.profileRef.imageUrl} alt={member.profileRef.name} width={80} height={80} className="rounded-full mx-auto mb-2 object-cover" />}
                          <h4 className="font-bold text-black text-sm">{member.profileRef.name}{member.isTeamLead ? ' (Lead)' : ''}</h4>
                          <p className="text-xs text-gray-600">{member.projectRole}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {(project.projectType === 'solo' && project.soloContributor) && (
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 text-black flex items-center gap-2"><FaUsers className="text-blue-500" /> Contributor</h3>
                    <div className="text-center">
                      {project.soloContributor.profileRef.imageUrl && <Image src={project.soloContributor.profileRef.imageUrl} alt={project.soloContributor.profileRef.name} width={80} height={80} className="rounded-full mx-auto mb-2 object-cover" />}
                      <h4 className="font-bold text-black text-sm">{project.soloContributor.profileRef.name}</h4>
                      <p className="text-xs text-gray-600">{project.soloContributor.projectRole}</p>
                    </div>
                  </div>
                )}
              </aside>
    
              <div className="lg:col-span-2 space-y-8">
                <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                  {project.status && (
                    <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-bold rounded-full mb-4 ${project.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {project.status === 'completed' ? <FaCheckCircle /> : <FaHourglassHalf />}
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  )}
                  <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-black flex items-center gap-3"><FaCode className="text-purple-500" /> {project.title}</h1>
                  <div className="flex flex-wrap gap-3 mt-6 mb-4">
                    {project.githubUrl && (
                      <Link href={project.githubUrl} target="_blank">
                        <button className="bg-gray-800 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-black transition-colors flex items-center gap-2">
                          <FaGithub /> View on GitHub
                        </button>
                      </Link>
                    )}
                    {project.liveUrl && (
                      <Link href={project.liveUrl} target="_blank">
                        <button className="bg-orange-500 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-orange-600 transition-opacity flex items-center gap-2">
                          <FaExternalLinkAlt /> Live Demo
                        </button>
                      </Link>
                    )}
                  </div>
                  <ShareButtons title={project.title} description={project.description} />
                </section>
    
                {project.description && (
                  <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-xl md:text-2xl font-bold text-black mb-4 flex items-center gap-2"><FaInfoCircle className="text-gray-500" /> About this Project</h2>
                    <div className="prose max-w-none text-base leading-relaxed md:text-lg">
                      <PortableTextComponent value={project.description} />
                    </div>
                  </section>
                )}

                {relatedProjects.length > 0 && (
                  <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-xl md:text-2xl font-bold text-black mb-4 flex items-center gap-2"><FaProjectDiagram className="text-green-500" /> Related Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {relatedProjects.map(relatedProject => (
                        <ProjectCard key={relatedProject._id} project={relatedProject} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        </main>
  );
}
