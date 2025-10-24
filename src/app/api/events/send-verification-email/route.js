import { createClient } from '@sanity/client';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { Resend } from 'resend'; // Using Resend's official library

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { email, eventId } = await request.json();

    if (!email || !eventId) {
      return NextResponse.json({ error: 'Email and Event ID are required.' }, { status: 400 });
    }

    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token valid for 1 hour

    const verificationDoc = {
      _type: 'emailVerification',
      email: email,
      event: {
        _ref: eventId,
        _type: 'reference',
      },
      token: token,
      expiresAt: expiresAt.toISOString(),
      isVerified: false,
      createdAt: new Date().toISOString(),
    };

    await sanityClient.create(verificationDoc);

    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/events/${eventId}?verifyEmail=true&token=${token}&email=${encodeURIComponent(email)}`;

    await resend.emails.send({
      from: process.env.EMAIL_FROM, // Must be a verified sender in Resend
      to: email,
      subject: 'Verify your email for event registration',
      html: `
        <p>Hello,</p>
        <p>Please click the link below to verify your email address for event registration:</p>
        <p><a href="${verificationLink}">Verify Email Address</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    return NextResponse.json({ message: 'Verification email sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error sending verification email:', error);
    return NextResponse.json({ error: 'Failed to send verification email.' }, { status: 500 });
  }
}
