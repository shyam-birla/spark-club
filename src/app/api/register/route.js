
import { NextResponse } from 'next/server';

export async function POST(request) {
  const data = await request.json();
  console.log('Event registration form submission:', data);
  return NextResponse.json({ message: `Thanks for registering, ${data.name}!` });
}
