// src/app/projects/[slug]/page.js

import { client } from '../../../../sanity/lib/client';
import Image from 'next/image';
import Link from 'next/link';
// Rich text render karne ke liye import karein
import { PortableText } from '@portabletext/react';

// Query ko update karein taaki team members ka data bhi aaye
const projectQuery = `*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  description,
  "imageUrl": image.asset->url,
  tags,
  githubUrl,
  liveUrl, // Naya field
  status, // Naya field
  teamMembers[]->{ // Team members ka data fetch karein
    _id,
    name,
    role,
    "imageUrl": image.asset->url
  }
}`;

// ... (generateMetadata function yahan aa sakta hai)

export default async function ProjectDetailPage({ params }) {
  const { slug } = params;
  const project = await client.fetch(projectQuery, { slug });

  if (!project) {
    return <div>Project not found.</div>;
  }

  return (
    <main className="container mx-auto px-4 py-20 text-white bg-black">
      {/* Status Badge */}
      {project.status && (
        <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-4 ${
          project.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
        }`}>
          {project.status}
        </span>
      )}

      <h1 className="text-4xl md:text-6xl font-bold mb-4">{project.title}</h1>

      {/* Image... (existing code) */}

      {/* Tags... (existing code) */}

      {/* Rich Text Description */}
      <div className="prose prose-invert max-w-none text-lg text-gray-300 leading-relaxed mb-8">
        <PortableText value={project.description} />
      </div>

      {/* Dual Buttons */}
      <div className="flex gap-4 mb-12">
        {project.githubUrl && (
          <Link href={project.githubUrl} target="_blank">
            <button className="bg-gray-700 text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-gray-600 transition-colors">
              View on GitHub →
            </button>
          </Link>
        )}
        {project.liveUrl && (
          <Link href={project.liveUrl} target="_blank">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-orange-600 transition-colors">
              Live Demo 🚀
            </button>
          </Link>
        )}
      </div>

      {/* Team Members Section */}
      {project.teamMembers && project.teamMembers.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold mb-6">Meet the Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {project.teamMembers.map(member => (
              <div key={member._id} className="text-center">
                {member.imageUrl && <Image src={member.imageUrl} alt={member.name} width={100} height={100} className="rounded-full mx-auto mb-2" />}
                <h3 className="font-bold">{member.name}</h3>
                <p className="text-sm text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}