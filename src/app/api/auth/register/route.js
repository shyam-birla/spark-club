import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { serverWriteClient } from '../../../../../sanity/lib/client';

export async function POST(request) {
  try {
    const { email, password, userName } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await serverWriteClient.fetch(
      `*[_type == "profile" && userEmail == $email][0]`,
      { email }
    );

    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    // Create a predictable, unique ID for the user's profile
    const sanitizedEmail = email.replace(/[\.@]/g, '-');
    const profileId = `profile-${sanitizedEmail}`;

    // Create new user profile in Sanity
    const newUser = {
      _id: profileId,
      _type: 'profile',
      userEmail: email,
      userName: userName || email.split('@')[0], // Use provided name or derive from email
      hashedPassword: hashedPassword,
      role: 'member', // Default role
    };

    await serverWriteClient.create(newUser);

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
