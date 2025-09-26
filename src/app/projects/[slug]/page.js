import { client } from '../../../../sanity/lib/client';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';

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
  tags,
  githubUrl,
  liveUrl,
  status,
  technologies[]->{
    _id,
    name,
    "logoUrl": logo.asset->url
  },
  teamMembers[]->{
    _id,
    name,
    role,
    "imageUrl": image.asset->url
  }
}`;

export default async function ProjectDetailPage({ params }) {
  const { slug } = await Promise.resolve(params);
  const project = await client.fetch(projectQuery, { slug });

  if (!project) {
    return <div>Project not found.</div>;
  }

  return (
    <main className="container mx-auto px-4 py-20">
      {project.status && (
        <span className={`inline-block px-3 py-1 text-sm font-bold rounded-full mb-4 ${
          project.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </span>
      )}

      <h1 className="text-4xl md:text-6xl font-bold mb-4 text-black">{project.title}</h1>
      
      {/* === YAHAN BADLAV KIYA GAYA HAI === */}
      {project.mainImageUrl && (
        <div className="relative w-full h-96 my-8 bg-transparent rounded-lg">
          <Image src={project.mainImageUrl} alt={project.title} fill className="object-contain rounded-lg" />
        </div>
      )}
      
      <div className="prose max-w-none text-lg leading-relaxed mb-8">
        <PortableText value={project.description} />
      </div>

      <div className="flex gap-4 mb-12">
        {project.githubUrl && (
          <Link href={project.githubUrl} target="_blank">
            <button className="bg-gray-200 text-black px-6 py-3 rounded-md font-semibold text-lg hover:bg-gray-300 transition-colors">
              View on GitHub →
            </button>
          </Link>
        )}
        {project.liveUrl && (
          <Link href={project.liveUrl} target="_blank">
            <button className="bg-black text-white px-6 py-3 rounded-md font-semibold text-lg hover:opacity-80 transition-opacity">
              Live Demo 🚀
            </button>
          </Link>
        )}
      </div>

      {project.technologies && project.technologies.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-black">Technologies Used</h2>
          <div className="flex flex-wrap gap-4">
            {project.technologies.map(tech => (
              <div key={tech._id} className="flex items-center gap-2 bg-gray-100 p-2 pr-4 rounded-md border border-gray-200">
                {tech.logoUrl && <Image src={tech.logoUrl} alt={tech.name} width={24} height={24} />}
                <span className="font-semibold">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.teamMembers && project.teamMembers.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold mb-6 text-black">Meet the Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {project.teamMembers.map(member => (
              <div key={member._id} className="text-center">
                {member.imageUrl && <Image src={member.imageUrl} alt={member.name} width={100} height={100} className="rounded-full mx-auto mb-2 object-cover" />}
                <h3 className="font-bold text-black">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
