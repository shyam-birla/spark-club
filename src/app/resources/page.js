import { client } from '../../../sanity/lib/client';
import CategoryList from '@/components/CategoryList';

const categoriesWithRoadmapsQuery = `*[_type == "category"] | order(displayOrder asc) {
  _id,
  title,
  description,
  "roadmaps": *[_type == "stream" && ^._id in categories[].category._ref]{
    ...,
    "slug": slug.current,
    "coverImageUrl": coverImage.asset->url,
    "categoryOrder": categories[category._ref == ^.^._id][0].displayOrder
  } | order(categoryOrder asc)
}`;

export default async function ResourcesDiscoveryPage() {
  const categories = await client.fetch(categoriesWithRoadmapsQuery);

  return (
    // === YAHAN BADLAV KIYA GAYA HAI ===
    // Main tag ko background diya gaya hai
    <main className="bg-gray-50/50 backdrop-blur-sm py-12 md:py-20">
      {/* Content ko center mein rakhne ke liye ek naya container div banaya hai */}
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-black">Learning Roadmaps</h1>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
              Your step-by-step guide to mastering new skills. Browse our curated learning paths below, organized by category.
          </p>
        </div>
        
        <CategoryList categories={categories} />
      </div>
    </main>
  );
}