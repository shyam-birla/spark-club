'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEdit, FaTrash, FaBlog, FaProjectDiagram, FaFlask, FaPlusCircle, FaSpinner } from 'react-icons/fa';
import { client } from '../../../../sanity/lib/client';
import { toast } from 'react-hot-toast';

export default function MyContentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [content, setContent] = useState({ blogPosts: [], projects: [], researchProjects: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      const userEmail = session.user.email;
      const query = `*[_type == "profile" && userEmail == $email][0]{
        "blogPosts": *[_type == "blogPost" && author._ref == ^._id]{_id, title, "slug": slug.current},
        "projects": *[_type == "project" && author._ref == ^._id]{_id, title, "slug": slug.current},
        "researchProjects": *[_type == "researchProject" && author._ref == ^._id]{_id, title, "slug": slug.current}
      }`;

      client.fetch(query, { email: userEmail }).then(data => {
        if (data) {
          setContent(data);
        }
        setLoading(false);
      }).catch(error => {
        console.error('Error fetching user content:', error);
        toast.error('Failed to load your content.');
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
          blogPosts: prev.blogPosts.filter(post => post.slug !== slug),
        }));

        toast.success('Blog post deleted successfully!');
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong. Please try again.');
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
          projects: prev.projects.filter(project => project.slug !== slug),
        }));

        toast.success('Project deleted successfully!');
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong. Please try again.');
      }
    }
  };

  const handleDeleteResearchProject = async (slug) => {
    if (window.confirm('Are you sure you want to delete this research project?')) {
      try {
        const response = await fetch(`/api/research/${slug}`,
          {
            method: 'DELETE',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to delete research project');
        }

        setContent(prev => ({
          ...prev,
          researchProjects: prev.researchProjects.filter(project => project.slug !== slug),
        }));

        toast.success('Research project deleted successfully!');
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
        <p className="ml-4 text-lg text-gray-700">Loading your content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Content</h1>
      
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
          <FaBlog className="text-orange-500" /> My Blog Posts
        </h2>
        {content.blogPosts.length > 0 ? (
          <ul className="space-y-4">
            {content.blogPosts.map(post => (
              <li key={post._id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                <Link href={`/blog/${post.slug}`} className="font-semibold text-blue-600 hover:underline">
                  {post.title}
                </Link>
                <div className="flex items-center gap-4">
                  <Link href={`/blog/${post.slug}/edit`} className="text-blue-600 hover:text-blue-800 transition-colors" title="Edit Blog Post">
                    <FaEdit />
                  </Link>
                  <button onClick={() => handleDeleteBlogPost(post.slug)} className="text-red-600 hover:text-red-800 transition-colors" title="Delete Blog Post">
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">
            You haven't written any blog posts yet. <Link href="/blog/new" className="text-blue-600 hover:underline flex items-center gap-1 inline-flex"><FaPlusCircle /> Start a new one!</Link>
          </p>
        )}
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
          <FaProjectDiagram className="text-purple-500" /> My Projects
        </h2>
        {content.projects.length > 0 ? (
          <ul className="space-y-4">
            {content.projects.map(project => (
              <li key={project._id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                <Link href={`/projects/${project.slug}`} className="font-semibold text-blue-600 hover:underline">
                  {project.title}
                </Link>
                <div className="flex items-center gap-4">
                  <Link href={`/projects/${project.slug}/edit`} className="text-blue-600 hover:text-blue-800 transition-colors" title="Edit Project">
                    <FaEdit />
                  </Link>
                  <button onClick={() => handleDeleteProject(project.slug)} className="text-red-600 hover:text-red-800 transition-colors" title="Delete Project">
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">
            You haven't created any projects yet. <Link href="/projects/new" className="text-blue-600 hover:underline flex items-center gap-1 inline-flex"><FaPlusCircle /> Start a new one!</Link>
          </p>
        )}
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
          <FaFlask className="text-green-500" /> My Research Projects
        </h2>
        {content.researchProjects.length > 0 ? (
          <ul className="space-y-4">
            {content.researchProjects.map(research => (
              <li key={research._id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                <Link href={`/research/${research.slug}`} className="font-semibold text-blue-600 hover:underline">
                  {research.title}
                </Link>
                <div className="flex items-center gap-4">
                  <Link href={`/research/${research.slug}/edit`} className="text-blue-600 hover:text-blue-800 transition-colors" title="Edit Research Project">
                    <FaEdit />
                  </Link>
                  <button onClick={() => handleDeleteResearchProject(research.slug)} className="text-red-600 hover:text-red-800 transition-colors" title="Delete Research Project">
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">
            You haven't submitted any research projects yet. <Link href="/research/new" className="text-blue-600 hover:underline flex items-center gap-1 inline-flex"><FaPlusCircle /> Submit a new one!</Link>
          </p>
        )}
      </section>
    </div>
  );
}
