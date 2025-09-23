// src/app/api/register/route.js

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
// Apne Sanity client ko import karein (path check kar lein)
import { client } from '../../../../sanity/lib/client';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    // Frontend se bheja gaya data receive karein
    const formData = await request.json();
    const { name, email, eventTitle } = formData;

    // --- 1. Data ko Sanity mein save karein (Optional, but recommended) ---
    // Iske liye aapko 'registration' naam ka ek schema banana hoga
    await client.create({
      _type: 'registration',
      name: name,
      email: email,
      eventTitle: eventTitle,
      registrationDate: new Date().toISOString(),
      ...formData, // Baaki ka form data bhi save kar dein
    });

    // --- 2. User ko confirmation email bhejein ---
    await resend.emails.send({
      from: 'Spark Club <onboarding@resend.dev>', // Aapka verified domain yahan aayega
      to: email, // Register karne waale ka email address
      subject: `Confirmation: You're registered for ${eventTitle}!`,
      html: `
        <h1>Hi ${name},</h1>
        <p>Thanks for registering for <strong>${eventTitle}</strong>!</p>
        <p>We're excited to see you at the event.</p>
        <p>Best,</p>
        <p>The Spark Club Team</p>
      `,
    });

    // Frontend ko success response bhejein
    return NextResponse.json({ message: 'Registration successful!' }, { status: 200 });

  } catch (error) {
    console.error('Registration failed:', error);
    // Frontend ko error response bhejein
    return NextResponse.json({ message: 'Registration failed.', error: error.message }, { status: 500 });
  }
}