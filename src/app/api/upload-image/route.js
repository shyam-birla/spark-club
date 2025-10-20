// src/app/api/upload-image/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { writeClient } from '../../../../sanity/lib/client';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();

    const document = await writeClient.assets.upload('image', Buffer.from(fileBuffer), {
      contentType: file.type,
      filename: file.name,
    });

    return NextResponse.json(document, { status: 200 });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json({ message: 'Image upload failed', error: error.message }, { status: 500 });
  }
}
