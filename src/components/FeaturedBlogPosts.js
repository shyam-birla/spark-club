'use client';
import Link from 'next/link';
import BlogPostCard from './BlogPostCard';
import { motion } from 'framer-motion';

const FeaturedBlogPosts = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    // === YAHAN BADLAV KIYA GAYA HAI ===
    // Background ko 50% transparent aur blurred kiya gaya hai
    <section className="py-20 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-black">Latest From The Blog</h2>
          <Link href="/blog">
            <button className="bg-black text-white px-6 py-2 rounded-md font-semibold hover:opacity-80 transition-opacity">
              Read More
            </button>
          </Link>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {posts.map(post => (
            <motion.div key={post._id} variants={cardVariants}>
              <BlogPostCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedBlogPosts;