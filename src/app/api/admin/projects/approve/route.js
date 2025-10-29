
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { writeClient } from '../../../../../../sanity/lib/client';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const { projectId } = await request.json();

  if (!projectId) {
    return new Response(JSON.stringify({ message: 'Project ID is required' }), { status: 400 });
  }

  try {
    await writeClient.patch(projectId).set({ approvalStatus: 'published' }).commit();
    return new Response(JSON.stringify({ message: 'Project approved' }), { status: 200 });
  } catch (error) {
    console.error('Error approving project:', error);
    return new Response(JSON.stringify({ message: 'Error approving project' }), { status: 500 });
  }
}
