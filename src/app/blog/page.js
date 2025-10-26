import { client } from '../../../sanity/lib/client';
import BlogListClient from '@/components/BlogListClient'; // Import the new client component

const postsQuery = `*[_type == "blogPost" && approvalStatus == "published"] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  "imageUrl": coverImage.asset->url,
  publishedAt,
  description // Add description to the query
}`;

export default async function BlogPage() {
  const posts = await client.fetch(postsQuery, {}, { cache: 'no-store' });

  return (
    <BlogListClient initialPosts={posts} />
  );
}