// src/app/projects/[slug]/page.js

import { client } from '../../../../sanity/lib/client'; // Path check kar lein
import Image from 'next/image';
import Link from 'next/link';

// Ek single project fetch karne ke liye GROQ query
// Yeh slug ke basis par project dhoondhega
const projectQuery = `*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  description,
  "imageUrl": image.asset->url,
  tags,
  githubUrl
}`;

// Page component ko 'params' milenge, jismein slug hoga
export default async function ProjectDetailPage({ params }) {
  const { slug } = params;
  
  // client.fetch ko query aur slug parameter pass karein
  const project = await client.fetch(projectQuery, { slug });

  // Agar project nahi milta hai toh
  if (!project) {
    return <div>Project not found.</div>;
  }

  return (
    <main className="bg-black container mx-auto px-4 py-20 text-white">
      {/* Project Title */}
      <h1 className="text-4xl md:text-6xl font-bold mb-4">{project.title}</h1>
      
      {/* Project Image */}
      {project.imageUrl && (
        <div className="relative w-full h-96 mb-8">
          <Image 
            src={project.imageUrl} 
            alt={project.title} 
            layout="fill" 
            objectFit="cover" 
            className="rounded-lg" 
          />
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {project.tags?.map(tag => (
          <span key={tag} className="bg-gray-700 text-gray-200 text-sm font-semibold px-3 py-1 rounded-full">{tag}</span>
        ))}
      </div>

      {/* Description */}
      <p className="text-lg text-gray-300 leading-relaxed mb-8">
        {project.description}
      </p>

      {/* GitHub Link */}
      {project.githubUrl && (
        <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
          <button className="bg-orange-500 text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-orange-600 transition-colors">
            View on GitHub →
          </button>
        </Link>
      )}
    </main>
  );
}