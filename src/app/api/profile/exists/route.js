// src/app/api/profile/exists/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { client } from '../../../../../sanity/lib/client';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ exists: false }, { status: 401 });
  }

  const userEmail = session.user.email;

  const query = `*[_type == "profile" && userEmail == $email][0]`;
  const profile = await client.fetch(query, { email: userEmail });

  return NextResponse.json({ exists: !!profile });
}
