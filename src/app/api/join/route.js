
import { NextResponse } from 'next/server';

export async function POST(request) {
  const data = await request.json();
  console.log('Join form submission:', data);
  return NextResponse.json({ message: 'Thank you for your interest! We will get back to you soon.' });
}
