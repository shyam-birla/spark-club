'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { client } from '../../../../sanity/lib/client';

export default function MyContentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [content, setContent] = useState({ blogPosts: [], projects: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      const userEmail = session.user.email;
      const query = `*[_type == "profile" && userEmail == $email][0]{
        "blogPosts": *[_type == "blogPost" && author._ref == ^._id]{_id, title, slug},
        "projects": *[_type == "project" && author._ref == ^._id]{_id, title, slug}
      }`;

      client.fetch(query, { email: userEmail }).then(data => {
        if (data) {
          setContent(data);
        }
        setLoading(false);
      });
    }
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, session, router]);

  const handleDeleteBlogPost = async (slug) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const response = await fetch(`/api/blog/${slug}`,
          {
            method: 'DELETE',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to delete blog post');
        }

        setContent(prev => ({
          ...prev,
          blogPosts: prev.blogPosts.filter(post => post.slug.current !== slug),
        }));

        alert('Blog post deleted successfully!');
      } catch (error) {
        console.error(error);
        alert('Something went wrong. Please try again.');
      }
    }
  };

  const handleDeleteProject = async (slug) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`/api/projects/${slug}`,
          {
            method: 'DELETE',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to delete project');
        }

        setContent(prev => ({
          ...prev,
          projects: prev.projects.filter(project => project.slug.current !== slug),
        }));

        alert('Project deleted successfully!');
      } catch (error) {
        console.error(error);
        alert('Something went wrong. Please try again.');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Content</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">My Blog Posts</h2>
          {content.blogPosts.length > 0 ? (
            <ul className="space-y-4">
              {content.blogPosts.map(post => (
                <li key={post._id} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                  <Link href={`/blog/${post.slug.current}`} className="font-semibold hover:underline">
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-4">
                    <Link href={`/blog/${post.slug.current}/edit`} className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </Link>
                    <button onClick={() => handleDeleteBlogPost(post.slug.current)} className="text-red-600 hover:text-red-800">
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>You haven't written any blog posts yet.</p>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">My Projects</h2>
          {content.projects.length > 0 ? (
            <ul className="space-y-4">
              {content.projects.map(project => (
                <li key={project._id} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                  <Link href={`/projects/${project.slug.current}`} className="font-semibold hover:underline">
                    {project.title}
                  </Link>
                  <div className="flex items-center gap-4">
                    <Link href={`/projects/${project.slug.current}/edit`} className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </Link>
                    <button onClick={() => handleDeleteProject(project.slug.current)} className="text-red-600 hover:text-red-800">
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>You haven't created any projects yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
