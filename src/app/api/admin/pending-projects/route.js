
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { client } from '../../../../../sanity/lib/client';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const pendingProjects = await client.fetch(
      `*[_type == "project" && approvalStatus == 'pending_approval']{
        _id,
        title,
        "slug": slug.current,
        author->{
          name
        }
      }`
    );

    return NextResponse.json(pendingProjects);
  } catch (error) {
    console.error('Error fetching pending projects:', error);
    return new Response(JSON.stringify({ message: 'Error fetching pending projects' }), { status: 500 });
  }
}
