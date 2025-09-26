import { createClient } from '@sanity/client';
import { NextResponse } from 'next/server';

// Initialize the Sanity client with write permissions
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  useCdn: false, // Must be false to use the write token
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export async function POST(request) {
  try {
    const { name, email, year, branch, interests } = await request.json();

    // Create a new document in Sanity of type 'memberApplication'
    await client.create({
      _type: 'memberApplication',
      name: name,
      email: email,
      year: year,
      branch: branch,
      interests: interests,
      applicationDate: new Date().toISOString(),
    });

    return NextResponse.json({ message: 'Thank you for your application! We will get back to you soon.' }, { status: 200 });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json({ message: 'Error submitting application', error: error.message }, { status: 500 });
  }
}
