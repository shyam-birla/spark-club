import Link from 'next/link';
import Image from 'next/image';

const BlogPostCard = ({ post }) => {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="bg-gray-800 rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer h-full flex flex-col">
        <div className="relative w-full h-48">
          <Image
            src={post.imageUrl || '/placeholder.png'}
            alt={post.title}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-white flex-grow">{post.title}</h3>
          <p className="text-gray-400 text-sm mt-2">{formattedDate}</p>
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;