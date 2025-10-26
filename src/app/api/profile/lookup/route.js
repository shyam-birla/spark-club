
import { client } from '../../../../sanity/lib/client';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { uniqueProfileId } = await req.json();

    if (!uniqueProfileId) {
      return NextResponse.json({ error: 'uniqueProfileId is required' }, { status: 400 });
    }

    const profile = await client.fetch(
      `*[_type == "profile" && uniqueProfileId == $uniqueProfileId][0]{
        _id,
        name,
        "profileImage": profileImage.asset->url,
        uniqueProfileId
      }`,
      { uniqueProfileId }
    );

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
