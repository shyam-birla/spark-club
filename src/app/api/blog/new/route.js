
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { client } from '../../../../../sanity/lib/client';

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const { title, body, coverImage, author } = await request.json();
  const userEmail = session.user.email;

  try {
    const profile = await client.fetch(`*[_type == "profile" && userEmail == $email][0]`, { email: userEmail });

    if (!profile) {
      return new Response(JSON.stringify({ message: 'Profile not found' }), { status: 404 });
    }

    const newPost = {
      _type: 'blogPost',
      title,
      slug: { _type: 'slug', current: title.toLowerCase().replace(/\s+/g, '-').slice(0, 96) },
      author,
      body: [{ _type: 'block', children: [{ _type: 'span', text: body }] }],
      coverImage,
      publishedAt: new Date().toISOString(),
      approvalStatus: 'pending_approval',
    };

    const createdPost = await client.create(newPost);

    return new Response(JSON.stringify(createdPost), { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return new Response(JSON.stringify({ message: 'Error creating post' }), { status: 500 });
  }
}
