
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { client } from '../../../../../sanity/lib/client';

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const { documentId, action } = await request.json();

  if (!documentId || !action) {
    return new Response(JSON.stringify({ message: 'Missing documentId or action' }), { status: 400 });
  }

  let newStatus;
  if (action === 'approve') {
    newStatus = 'published';
  } else if (action === 'reject') {
    newStatus = 'draft';
  } else {
    return new Response(JSON.stringify({ message: 'Invalid action' }), { status: 400 });
  }

  try {
    await client
      .patch(documentId)
      .set({ approvalStatus: newStatus })
      .commit();

    return new Response(JSON.stringify({ message: 'Content status updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating content status:', error);
    return new Response(JSON.stringify({ message: 'Error updating content status' }), { status: 500 });
  }
}
