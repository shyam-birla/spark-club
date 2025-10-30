
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { client, serverWriteClient } from '../../../../../sanity/lib/client';

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const userEmail = session.user.email;
  const { slug } = params;
  const updatedData = await request.json();

  try {
    const post = await client.fetch(`*[_type == "blogPost" && slug.current == $slug][0]`, { slug });

    if (!post) {
      return new Response(JSON.stringify({ message: 'Post not found' }), { status: 404 });
    }

    const profile = await client.fetch(`*[_type == "profile" && userEmail == $email][0]`, { email: userEmail });

    if (post.author._ref !== profile._id) {
      return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
    }

    // Prepare update object for Sanity
    const patch = {};
    if (updatedData.title) patch.title = updatedData.title;
    if (updatedData.category) patch.category = updatedData.category;
    if (updatedData.body) patch.body = updatedData.body;
    if (updatedData.coverImage) patch.coverImage = updatedData.coverImage;

    await serverWriteClient
      .patch(post._id)
      .set(patch)
      .commit();

    return new Response(JSON.stringify({ message: 'Blog post updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return new Response(JSON.stringify({ message: 'Error updating blog post' }), { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const userEmail = session.user.email;
  const { slug } = params;

  try {
    const post = await client.fetch(`*[_type == "blogPost" && slug.current == $slug][0]`, { slug });

    if (!post) {
      return new Response(JSON.stringify({ message: 'Post not found' }), { status: 404 });
    }

    const profile = await client.fetch(`*[_type == "profile" && userEmail == $email][0]`, { email: userEmail });

    if (post.author._ref !== profile._id) {
      return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
    }

    await client.delete(post._id);

    return new Response(JSON.stringify({ message: 'Post deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return new Response(JSON.stringify({ message: 'Error deleting post' }), { status: 500 });
  }
}
