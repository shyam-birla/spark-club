import { client } from '../../../../sanity/lib/client';
import PortableTextComponent from '@/components/PortableTextComponent';
import Image from 'next/image';
import { FaUser, FaCalendar } from 'react-icons/fa';
import BlogPostCard from '@/components/BlogPostCard';

export async function generateStaticParams() {
  const slugs = await client.fetch(`*[_type == "blogPost" && defined(slug.current)]{ "slug": slug.current }`);
  return slugs;
}

const postQuery = `*[_type == "blogPost" && slug.current == $slug][0]{
  _id,
  title,
  "imageUrl": coverImage.asset->url,
  publishedAt,
  description, // Added description to the query
  author->{
    name,
    "authorImageUrl": image.asset->url
  },
  body
}`;

const relatedPostsQuery = `*[_type == "blogPost" && _id != $currentPostId && approvalStatus == "published"] | order(publishedAt desc) [0...3]{
  _id,
  title,
  "slug": slug.current,
  "imageUrl": coverImage.asset->url,
  publishedAt
}`;

export default async function BlogPostPage({ params }) {
  const { slug } = await Promise.resolve(params);
  const post = await client.fetch(postQuery, { slug });

  if (!post) {
    return <div>Post not found.</div>;
  }

  const relatedPosts = await client.fetch(relatedPostsQuery, { currentPostId: post._id });

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    // Main tag mein background style add kiya
    <main className="bg-white/80 backdrop-blur-sm py-20">
      <article className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">{post.title}</h1>
        
        <div className="flex items-center gap-4 mb-8">
          {post.author?.authorImageUrl && (
            <Image 
              src={post.author.authorImageUrl} 
              alt={post.author.name}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-semibold text-black flex items-center gap-2"><FaUser className="text-gray-500" /> {post.author?.name || 'Anonymous'}</p>
            <p className="text-gray-600 text-sm flex items-center gap-2"><FaCalendar className="text-gray-500" /> {formattedDate}</p>
          </div>
        </div>

        {post.imageUrl && (
          <div className="relative w-full h-96 mb-8">
            <Image 
              src={post.imageUrl} 
              alt={post.title} 
              fill
              className="object-cover rounded-lg" 
            />
          </div>
        )}

        <div className="prose lg:prose-xl max-w-none leading-relaxed">
          <PortableTextComponent value={post.body} />
        </div>

        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-black mb-6">More from the Blog</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map(relatedPost => (
                <BlogPostCard key={relatedPost._id} post={relatedPost} />
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}