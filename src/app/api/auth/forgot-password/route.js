import { NextResponse } from 'next/server';
import { serverWriteClient } from '../../../../../sanity/lib/client';
import { v4 as uuidv4 } from 'uuid';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const userProfile = await serverWriteClient.fetch(
      `*[_type == "profile" && userEmail == $email][0]`,
      { email }
    );

    // Always return a generic success message for security reasons
    // to prevent user enumeration attacks.
    if (!userProfile) {
      console.log(`Forgot password request for non-existent email: ${email}`);
      return NextResponse.json({ message: 'If an account with that email exists, a password reset link has been sent.' }, { status: 200 });
    }

    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now

    await serverWriteClient
      .patch(userProfile._id)
      .set({ passwordResetToken: resetToken, passwordResetExpires: resetTokenExpiry })
      .commit();

    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev', // Replace with your verified Resend sender email
        to: email,
        subject: 'Password Reset Request',
        html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p><p>This link is valid for 1 hour.</p>`,
      });
      console.log(`Password reset email sent to ${email}`);
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError);
      // Do not expose email sending failure to the user for security reasons
    }

    return NextResponse.json({ message: 'If an account with that email exists, a password reset link has been sent.' }, { status: 200 });
  } catch (error) {
    console.error('Forgot password API error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
