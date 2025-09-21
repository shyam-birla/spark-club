const PostGrid = () => {
  const posts = [
    {
      id: 1,
      title: 'Getting Started with React',
      author: 'Ankit Sharma',
      excerpt: 'Learn the basics of React and start building interactive UIs.',
    },
    {
      id: 2,
      title: 'Deep Learning for Beginners',
      author: 'Pooja Singh',
      excerpt: 'An introduction to deep learning concepts and frameworks.',
    },
  ];

  return (
    <section className="container mx-auto px-4 pb-20">
      <h2 className="text-3xl font-bold mb-6">Latest Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <article key={post.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
            {/* Author with improved contrast */}
            <p className="text-gray-700 mb-3">By {post.author}</p>
            <p className="text-gray-700">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default PostGrid;
