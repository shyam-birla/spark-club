'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { client } from '../../../../sanity/lib/client';

export default function ApprovalsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [content, setContent] = useState({ blogPosts: [], projects: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      if (session.user.role !== 'admin') {
        router.push('/');
        return;
      }

      const query = `{
        "blogPosts": *[_type == "blogPost" && approvalStatus == "pending_approval"],        "projects": *[_type == "project" && approvalStatus == "pending_approval"]
      }`;

      client.fetch(query).then(data => {
        setContent(data);
        setLoading(false);
      });
    }
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, session, router]);

  const handleApproval = async (documentId) => {
    try {
      const response = await fetch('/api/admin/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, action: 'approve' }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve content');
      }

      setContent(prev => ({
        ...prev,
        blogPosts: prev.blogPosts.filter(post => post._id !== documentId),
        projects: prev.projects.filter(project => project._id !== documentId),
      }));

      alert('Content approved successfully!');
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleRejection = async (documentId) => {
    try {
      const response = await fetch('/api/admin/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, action: 'reject' }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject content');
      }

      setContent(prev => ({
        ...prev,
        blogPosts: prev.blogPosts.filter(post => post._id !== documentId),
        projects: prev.projects.filter(project => project._id !== documentId),
      }));

      alert('Content rejected successfully!');
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Content Approvals</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Blog Posts</h2>
          {content.blogPosts.length > 0 ? (
            <ul className="space-y-4">
              {content.blogPosts.map(post => (
                <li key={post._id} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                  <span>{post.title}</span>
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleApproval(post._id)} className="text-green-600 hover:text-green-800">Approve</button>
                    <button onClick={() => handleRejection(post._id)} className="text-red-600 hover:text-red-800">Reject</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No blog posts pending approval.</p>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Projects</h2>
          {content.projects.length > 0 ? (
            <ul className="space-y-4">
              {content.projects.map(project => (
                <li key={project._id} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                  <span>{project.title}</span>
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleApproval(project._id)} className="text-green-600 hover:text-green-800">Approve</button>
                    <button onClick={() => handleRejection(project._id)} className="text-red-600 hover:text-red-800">Reject</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No projects pending approval.</p>
          )}
        </section>
      </div>
    </div>
  );
}
