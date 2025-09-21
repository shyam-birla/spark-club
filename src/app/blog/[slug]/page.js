import { client } from '../../../../sanity/lib/client';
import PortableTextComponent from '@/components/PortableTextComponent'; // We will create this next
import Image from 'next/image';

const postQuery = `*[_type == "blogPost" && slug.current == $slug][0]{
  _id,
  title,
  "imageUrl": coverImage.asset->url,
  publishedAt,
  // Expand the author reference to get their name and image
  author->{
    name,
    "authorImageUrl": image.asset->url
  },
  // The rich text content
  body
}`;

export default async function BlogPostPage({ params }) {
  const { slug } = params;
  const post = await client.fetch(postQuery, { slug });

  if (!post) {
    return <div>Post not found.</div>;
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="container mx-auto px-4 py-20">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{post.title}</h1>
        
        {/* Author Info */}
        <div className="flex items-center gap-4 mb-8">
          {post.author?.authorImageUrl && (
            <img 
              src={post.author.authorImageUrl} 
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-semibold text-white">{post.author?.name || 'Anonymous'}</p>
            <p className="text-gray-400 text-sm">{formattedDate}</p>
          </div>
        </div>

        {/* Cover Image */}
        {post.imageUrl && (
          <div className="relative w-full h-96 mb-8">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover rounded-lg" 
            />
          </div>
        )}

        {/* Post Body Content */}
        <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
          <PortableTextComponent value={post.body} />
        </div>
      </article>
    </main>
  );
}