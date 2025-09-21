// src/app/api/contact/route.js
import { createClient } from '@sanity/client';
import { NextResponse } from 'next/server';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  useCdn: false, // Must be false to use the write token
  token: process.env.SANITY_API_WRITE_TOKEN, // Use the write token
});

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();
    
    await client.create({
      _type: 'contactSubmission',
      name: name,
      email: email,
      subject: subject,
      message: message,
      read: false,
    });

    return NextResponse.json({ message: 'Form submitted successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json({ message: 'Error submitting form', error: error.message }, { status: 500 });
  }
}