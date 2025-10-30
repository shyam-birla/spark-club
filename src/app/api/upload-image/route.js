import { serverWriteClient } from '../../../../sanity/lib/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return new Response(JSON.stringify({ message: 'No file uploaded' }), { status: 400 });
    }

    const asset = await serverWriteClient.assets.upload('image', file);

    return new Response(JSON.stringify({ assetId: asset._id, assetUrl: asset.url }), { status: 201 });
  } catch (error) {
    console.error('Error uploading image:', error);
    return new Response(JSON.stringify({ message: 'Error uploading image', error: error.message }), { status: 500 });
  }
}