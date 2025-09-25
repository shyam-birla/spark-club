import { client } from '../../../../sanity/lib/client';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';

const projectQuery = `*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  description,
  "imageUrl": image.asset->url,
  tags,
  githubUrl,
  liveUrl,
  status,
  teamMembers[]->{
    _id,
    name,
    role,
    "imageUrl": image.asset->url
  }
}`;

export default async function ProjectDetailPage({ params }) {
  const { slug } = params;
  const project = await client.fetch(projectQuery, { slug });

  if (!project) {
    return <div>Project not found.</div>;
  }

  return (
    // Main container se dark theme colors hataye
    <main className="container mx-auto px-4 py-20">
      {/* Status Badge ko light theme ke liye update kiya */}
      {project.status && (
        <span className={`inline-block px-3 py-1 text-sm font-bold rounded-full mb-4 ${
          project.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </span>
      )}

      <h1 className="text-4xl md:text-6xl font-bold mb-4 text-black">{project.title}</h1>
      
      {/* NOTE: Please ensure your Image component code is here */}
      
      {/* Rich Text Description ko light theme ke liye update kiya */}
      <div className="prose max-w-none text-lg leading-relaxed mb-8">
        <PortableText value={project.description} />
      </div>

      {/* Buttons ko light theme ke liye update kiya */}
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

      {/* Team Members Section ko light theme ke liye update kiya */}
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