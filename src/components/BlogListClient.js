'use client';

import { useState, useEffect, useMemo } from 'react';
import { FaBlog, FaSearch } from 'react-icons/fa';
import BlogPostCard from '@/components/BlogPostCard';
import CallToAction from '@/components/CallToAction';

const BlogListClient = ({ initialPosts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest', 'a-z', 'z-a'
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);

  useEffect(() => {
    let postsToFilter = [...initialPosts];

    // Filter by search query
    if (searchQuery) {
      postsToFilter = postsToFilter.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description?.toLowerCase().includes(searchQuery.toLowerCase()) // Assuming description might exist
      );
    }

    // Sort posts
    postsToFilter.sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      } else if (sortOrder === 'oldest') {
        return new Date(a.publishedAt) - new Date(b.publishedAt);
      } else if (sortOrder === 'a-z') {
        return a.title.localeCompare(b.title);
      } else if (sortOrder === 'z-a') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

    setFilteredPosts(postsToFilter);
  }, [initialPosts, searchQuery, sortOrder]);

  return (
    <main className="bg-white/80 backdrop-blur-sm py-20">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-black flex items-center justify-center gap-3"><FaBlog className="text-blue-500" /> The SPARK Blog</h1>
          <p className="text-gray-600 mb-12">Insights, tutorials, and updates from the club.</p>
        </div>
        
        {/* Filter and Sort UI */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search blog posts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="w-full md:w-1/3">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
              <option value="a-z">Sort by: A-Z (Title)</option>
              <option value="z-a">Sort by: Z-A (Title)</option>
            </select>
          </div>
        </div>

        <CallToAction
          title="Have Something to Share?"
          description="We are always looking for new and interesting blog posts to share with the community. If you have an idea, we would love to hear it!"
          buttonText="Submit Your Blog Post"
          buttonLink="/blog/new"
        />

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogPostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8 bg-white rounded-lg shadow-sm">No blog posts found matching your criteria.</p>
        )}
      </div>
    </main>
  );
};

export default BlogListClient;
