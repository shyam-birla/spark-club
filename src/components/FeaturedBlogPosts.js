import Link from 'next/link';
import BlogPostCard from './BlogPostCard';

const FeaturedBlogPosts = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Latest From The Blog</h2>
          <Link href="/blog">
            <button className="bg-orange-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-orange-600 transition-colors">
              Read More
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map(post => (
            <BlogPostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogPosts;
