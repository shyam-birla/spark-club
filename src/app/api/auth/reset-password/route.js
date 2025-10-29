import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { serverWriteClient } from '../../../../../sanity/lib/client';

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ message: 'Token and new password are required' }, { status: 400 });
    }

    const userProfile = await serverWriteClient.fetch(
      `*[_type == "profile" && passwordResetToken == $token][0]`,
      { token }
    );

    if (!userProfile) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
    }

    const now = new Date();
    const expiry = new Date(userProfile.passwordResetExpires);

    if (now > expiry) {
      return NextResponse.json({ message: 'Token has expired' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await serverWriteClient
      .patch(userProfile._id)
      .set({ hashedPassword: hashedPassword })
      .unset(['passwordResetToken', 'passwordResetExpires'])
      .commit();

    return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
  } catch (error) {
    console.error('Reset password API error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
