import { NextResponse } from 'next/server';
import { writeClient } from '../../../../sanity/lib/client'; // Assuming writeClient is configured with a token

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Sanity
    const asset = await writeClient.assets.upload('file', buffer, {
      filename: file.name,
      contentType: file.type,
    });

    return NextResponse.json({ fileUrl: asset.url, assetId: asset._id }, { status: 200 });

  } catch (error) {
    console.error('Error uploading file to Sanity:', error);
    return NextResponse.json({ error: 'Failed to upload file.' }, { status: 500 });
  }
}
