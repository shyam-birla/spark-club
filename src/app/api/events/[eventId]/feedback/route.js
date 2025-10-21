import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { client } from '../../../../../sanity/lib/client';

// Likhne ke liye special client (write token ke saath)
const writeClient = client.withConfig({
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  ignoreBrowserTokenWarning: true,
});

export async function POST(request, { params }) {
  const { eventId } = params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userEmail = session.user.email;

  try {
    const { rating, comment } = await request.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ message: 'Rating is required and must be between 1 and 5.' }, { status: 400 });
    }

    // Check if the user has already submitted feedback for this event
    const existingFeedback = await client.fetch(
      `*[_type == "eventFeedback" && event._ref == $eventId && userProfile._ref in *[_type=="profile" && userEmail==$userEmail]._id][0]`,
      { eventId, userEmail }
    );

    if (existingFeedback) {
      return NextResponse.json({ message: 'You have already submitted feedback for this event.' }, { status: 409 });
    }

    // First, find the user's profile ID based on their email
    const profile = await client.fetch(
      `*[_type == "profile" && userEmail == $userEmail][0]{
        _id
      }`,
      { userEmail }
    );

    if (!profile) {
      return NextResponse.json({ message: 'User profile not found.' }, { status: 404 });
    }

    const userProfileId = profile._id;

    const feedbackDoc = {
      _type: 'eventFeedback',
      event: { _type: 'reference', _ref: eventId },
      userProfile: { _type: 'reference', _ref: userProfileId },
      rating: rating,
      comment: comment || '',
      submissionDate: new Date().toISOString(),
    };

    await writeClient.create(feedbackDoc);

    return NextResponse.json({ message: 'Feedback submitted successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
