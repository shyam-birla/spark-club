import Link from 'next/link';
import Image from 'next/image';
import { FaCalendar } from 'react-icons/fa';

const BlogPostCard = ({ post }) => {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/blog/${post.slug}`}>
      {/* Card ko light theme ke liye update kiya */}
      <div className="bg-gray-50 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer h-full flex flex-col border border-gray-200 hover:shadow-xl hover:scale-105 transform">
        <div className="relative w-full h-32">
          {/* Image component ko naye syntax ke hisaab se update kiya */}
          <Image
            src={post.imageUrl || '/placeholder.png'}
            alt={post.title}
            fill
            className="object-cover"
            unoptimized={post.imageUrl ? false : true}
          />
        </div>
        <div className="p-2 flex-grow flex flex-col">
          {/* Text ko light theme ke liye update kiya */}
          <h3 className="text-lg font-bold text-black flex-grow">{post.title}</h3>
          <p className="text-gray-600 text-xs mt-1 flex items-center"><FaCalendar className="mr-1" />{formattedDate}</p>
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;