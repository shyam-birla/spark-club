'use client';

import PendingProjects from '@/components/PendingProjects';

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <PendingProjects />
    </div>
  );
}