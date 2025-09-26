import { client } from '../../../sanity/lib/client';
import BlogPostCard from '@/components/BlogPostCard';

const postsQuery = `*[_type == "blogPost"] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  "imageUrl": coverImage.asset->url,
  publishedAt
}`;

export default async function BlogPage() {
  const posts = await client.fetch(postsQuery);

  return (
    // Main tag mein background style add kiya
    <main className="bg-white/40 backdrop-blur-sm py-20">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-black">The SPARK Blog</h1>
          <p className="text-gray-600 mb-12">Insights, tutorials, and updates from the club.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogPostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}