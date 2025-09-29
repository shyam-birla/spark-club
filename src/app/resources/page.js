// src/app/resources/page.js (FIXED - Duplicate component removed)

import { client } from '../../../sanity/lib/client';
import Link from 'next/link';
import Image from 'next/image';

// Query mein order() ko badal diya gaya hai
const categoriesWithRoadmapsQuery = `*[_type == "category"]{
  _id,
  title,
  description,
  "roadmaps": *[_type == "stream" && references(^._id)] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "coverImageUrl": coverImage.asset->url
  }
} | order(displayOrder asc)`;


// Roadmap Card component ko ab sirf ek baar define kiya gaya hai
const RoadmapCard = ({ roadmap }) => (
    <Link href={`/resources/${roadmap.slug}`} className="block h-full">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-full transform transition-all duration-300 hover:shadow-xl hover:scale-[1.03] group">
            <div className="relative w-full h-48">
                {roadmap.coverImageUrl ? (
                    <Image src={roadmap.coverImageUrl} alt={`${roadmap.title} cover image`} fill className="object-cover" />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center"><span className="text-gray-500">No Image</span></div>
                )}
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-2 group-hover:text-orange-600 transition-colors">{roadmap.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">{roadmap.description}</p>
            </div>
        </div>
    </Link>
);


export default async function ResourcesDiscoveryPage() {
  const categories = await client.fetch(categoriesWithRoadmapsQuery);

  return (
    <main className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 text-black">Learning Roadmaps</h1>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Your step-by-step guide to mastering new skills. Browse our curated learning paths below, organized by category.
        </p>
      </div>
      
      <div className="space-y-16">
        {categories.map((category) => {
          if (!category.roadmaps || category.roadmaps.length === 0) {
            return null;
          }
          
          return (
            <section key={category._id}>
              <h2 className="text-3xl font-bold text-black border-b pb-4 mb-8">{category.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.roadmaps.map((roadmap) => (
                  <RoadmapCard key={roadmap._id} roadmap={roadmap} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </main>
  );
}