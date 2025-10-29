'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function PendingProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchPendingProjects = async () => {
      try {
        const response = await fetch('/api/admin/pending-projects');
        if (!response.ok) {
          throw new Error('Failed to fetch pending projects');
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchPendingProjects();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Pending Projects</h2>
      {projects.length === 0 ? (
        <p>No projects are currently pending approval.</p>
      ) : (
        <ul className="space-y-4">
          {projects.map(project => (
            <li key={project._id} className="p-4 border rounded-md">
              <h3 className="text-xl font-bold">{project.title}</h3>
              <p>by {project.author.name}</p>
              <Link href={`/admin/approvals/${project.slug}`}>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">View Details</button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
