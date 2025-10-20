import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { client, urlFor } from '../../sanity/lib/client';
import NavBarClient from './NavBarClient';

export default async function NavBar() {
  const session = await getServerSession(authOptions);
  let profileImageUrl = session?.user?.image || null;

  if (session?.user?.email) {
    const query = `*[_type == "profile" && userEmail == $email][0]{ userImage }`;
    const profile = await client.fetch(query, { email: session.user.email });

    if (profile?.userImage) {
      profileImageUrl = urlFor(profile.userImage).width(40).height(40).url();
    }
  }

  return <NavBarClient session={session} profileImageUrl={profileImageUrl} />;
}
