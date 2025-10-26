
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { client } from '../../../../../sanity/lib/client';

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const { wantsEventNotifications, wantsNewsletter } = await request.json();
  const userEmail = session.user.email;

  try {
    const profile = await client.fetch(`*[_type == "profile" && userEmail == $email][0]`, { email: userEmail });

    if (!profile) {
      return new Response(JSON.stringify({ message: 'Profile not found' }), { status: 404 });
    }

    await client
      .patch(profile._id)
      .set({
        wantsEventNotifications,
        wantsNewsletter,
      })
      .commit();

    return new Response(JSON.stringify({ message: 'Preferences updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return new Response(JSON.stringify({ message: 'Error updating preferences' }), { status: 500 });
  }
}
