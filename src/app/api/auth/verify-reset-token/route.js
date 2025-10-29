import { NextResponse } from 'next/server';
import { serverWriteClient } from '../../../../../sanity/lib/client';

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ message: 'Token is required' }, { status: 400 });
    }

    const userProfile = await serverWriteClient.fetch(
      `*[_type == "profile" && passwordResetToken == $token][0]`,
      { token }
    );

    if (!userProfile) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
    }

    const now = new Date();
    const expiry = new Date(userProfile.passwordResetExpires);

    if (now > expiry) {
      return NextResponse.json({ message: 'Token has expired' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Token is valid' }, { status: 200 });
  } catch (error) {
    console.error('Verify reset token API error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
