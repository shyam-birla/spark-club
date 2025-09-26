import { client } from '../../../../sanity/lib/client';
import PortableTextComponent from '@/components/PortableTextComponent';
import Image from 'next/image';

export async function generateStaticParams() {
  const slugs = await client.fetch(`*[_type == "blogPost" && defined(slug.current)]{ "slug": slug.current }`);
  return slugs;
}

const postQuery = `*[_type == "blogPost" && slug.current == $slug][0]{
  _id,
  title,
  "imageUrl": coverImage.asset->url,
  publishedAt,
  author->{
    name,
    "authorImageUrl": image.asset->url
  },
  body
}`;

export default async function BlogPostPage({ params }) {
  const { slug } = await Promise.resolve(params);
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
    // Main tag mein background style add kiya
    <main className="bg-white/40 backdrop-blur-sm py-20">
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
            <p className="font-semibold text-black">{post.author?.name || 'Anonymous'}</p>
            <p className="text-gray-600 text-sm">{formattedDate}</p>
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
      </article>
    </main>
  );
}