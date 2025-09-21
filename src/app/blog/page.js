import { client } from '../../../sanity/lib/client';
import BlogPostCard from '@/components/BlogPostCard'; // Hum yeh component abhi banayenge

// Sabhi blog posts ko publish date ke hisab se sort karke fetch karne ke liye query
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
    <main className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-2">The SPARK Blog</h1>
      <p className="text-gray-400 mb-12">Insights, tutorials, and updates from the club.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogPostCard key={post._id} post={post} />
        ))}
      </div>
    </main>
  );
}