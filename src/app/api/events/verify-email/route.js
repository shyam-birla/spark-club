import { createClient } from '@sanity/client';
import { NextResponse } from 'next/server';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      return NextResponse.json({ error: 'Missing token or email.' }, { status: 400 });
    }

    // 1. Find the verification document in Sanity
    const verificationDoc = await sanityClient.fetch(
      `*[_type == "emailVerification" && email == $email && token == $token][0]`,
      { email, token }
    );

    if (!verificationDoc) {
      return NextResponse.json({ error: 'Invalid or expired verification link.' }, { status: 400 });
    }

    // 2. Check if already verified
    if (verificationDoc.isVerified) {
      return NextResponse.redirect(new URL(`/events/${verificationDoc.event._ref}?verificationStatus=alreadyVerified`, request.url));
    }

    // 3. Check if token has expired
    const now = new Date();
    const expiresAt = new Date(verificationDoc.expiresAt);
    if (now > expiresAt) {
      // Optionally, delete the expired token or mark it as expired
      await sanityClient.delete(verificationDoc._id);
      return NextResponse.redirect(new URL(`/events/${verificationDoc.event._ref}?verificationStatus=expired`, request.url));
    }

    // 4. Mark as verified
    await sanityClient.patch(verificationDoc._id).set({ isVerified: true }).commit();

    // Redirect to the event page with a success message
    return NextResponse.redirect(new URL(`/events/${verificationDoc.event._ref}?verificationStatus=success`, request.url));

  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json({ error: 'Failed to verify email.' }, { status: 500 });
  }
}
