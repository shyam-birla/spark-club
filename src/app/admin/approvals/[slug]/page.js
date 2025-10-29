'use client';

import { client } from '../../../../../sanity/lib/client';
import Image from 'next/image';
import Link from 'next/link';
import PortableTextComponent from '@/components/PortableTextComponent';
import Breadcrumbs from '@/components/Breadcrumbs';
import ImageGalleryWithLightbox from '@/components/ImageGalleryWithLightbox';
import { FaGithub, FaExternalLinkAlt, FaCheckCircle, FaHourglassHalf, FaCodeBranch, FaUsers, FaInfoCircle, FaCode, FaHome, FaProjectDiagram } from 'react-icons/fa';
import ShareButtons from '@/components/ShareButtons';
import ProjectCard from '@/components/ProjectCard';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

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

export default function AdminProjectApprovalPage({ params }) {
  const { slug } = params;
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (slug) {
      client.fetch(projectQuery, { slug }).then(data => {
        setProject(data);
      });
    }
  }, [slug]);

  const router = useRouter();

  const handleApprove = async () => {
    try {
      const response = await fetch('/api/admin/projects/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project._id }),
      });
      if (!response.ok) {
        throw new Error('Failed to approve project');
      }
      toast.success('Project approved!');
      router.push('/admin');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch('/api/admin/projects/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project._id }),
      });
      if (!response.ok) {
        throw new Error('Failed to reject project');
      }
      toast.success('Project rejected!');
      router.push('/admin');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!project) {
    return <div>Loading project...</div>;
  }

  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Pending Projects', href: '/admin' },
    { label: project.title },
  ];

  return (
    <main className="bg-white/80 backdrop-blur-sm py-12 md:py-20">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={breadcrumbs} className="mb-4" />
        <div className="mb-8 flex justify-between items-center">
          <Link href="/admin">
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold text-sm hover:bg-gray-300 transition-colors flex items-center gap-2">
              <FaHome /> Back to Admin
            </button>
          </Link>
          <div className="flex gap-4">
            <button onClick={handleApprove} className="bg-green-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-600 transition-colors">Approve</button>
            <button onClick={handleReject} className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600 transition-colors">Reject</button>
          </div>
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
          </div>
        </div>
      </div>
    </main>
  );
}
