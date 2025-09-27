// src/app/resources/page.js (NEW DISCOVERY PAGE VERSION)

import { client } from '../../../sanity/lib/client';
import Link from 'next/link';
import Image from 'next/image';

// Naya, simpler query sirf cards ke liye data fetch karega
const roadmapsQuery = `*[_type == "stream"]{
  _id,
  title,
  "slug": slug.current,
  description,
  "coverImageUrl": coverImage.asset->url
}`;

export default async function ResourcesDiscoveryPage() {
  const roadmaps = await client.fetch(roadmapsQuery);

  return (
    <main className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-2 text-black">Learning Roadmaps</h1>
      <p className="text-gray-600 mb-12">Your step-by-step guide to mastering new skills.</p>
      
      {/* Saare roadmaps ke liye ek grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {roadmaps.map((roadmap) => (
          // Har card ab ek Link hai jo detail page par le jaayega
          <Link key={roadmap._id} href={`/resources/${roadmap.slug}`} className="block">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-full transform transition-transform hover:scale-105 hover:shadow-xl group">
              
              <div className="relative w-full h-48">
                {roadmap.coverImageUrl ? (
                  <Image
                    src={roadmap.coverImageUrl}
                    alt={`${roadmap.title} cover image`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-bold text-black mb-2 group-hover:text-orange-600 transition-colors">{roadmap.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-3">{roadmap.description}</p>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}