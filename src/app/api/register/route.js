import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { client } from '../../../../sanity/lib/client';

const resend = new Resend(process.env.RESEND_API_KEY);
const sanityClient = client;

export async function POST(request) {
  try {
    const formData = await request.json();
    const { name, email, eventTitle } = formData;

    const event = await sanityClient.fetch(`*[_type == "event" && title == $eventTitle][0]`, { eventTitle });
    
    if (!event) {
      throw new Error(`Event with title "${eventTitle}" not found.`);
    }
    
    const eventId = event._id;

    await sanityClient.create({
      _type: 'registration',
      name: name,
      email: email,
      mobile: formData.mobile,
      branch: formData.branch,
      enrollmentNo: formData.enrollmentNo,
      year: formData.year,
      registrationDate: new Date().toISOString(),
      event: { _type: 'reference', _ref: eventId },
    });

    const eventDate = new Date(event.eventDate);
    const formattedDate = eventDate.toLocaleString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    
    const startTime = eventDate.toISOString().replace(/-|:|\.\d\d\d/g,"");
    const endTime = new Date(eventDate.getTime() + (2*60*60*1000)).toISOString().replace(/-|:|\.\d\d\d/g,"");
    const googleCalendarLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description?.[0]?.children?.[0]?.text || 'See you there!')}&location=${encodeURIComponent(event.venue?.locationName || 'Check website for details')}`;

    await resend.emails.send({
      from: 'Spark Club <onboarding@resend.dev>',
      to: email,
      subject: `✅ Confirmation: You're registered for ${eventTitle}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
            <img src="https://www.sparkclubsati.vercel.app/spark_email.png" alt="Spark Club Logo" style="max-width: 150px;">
          </div>
          <div style="padding: 20px; line-height: 1.6; color: #333;">
            <h1 style="color: #000; font-size: 24px;">Registration Confirmed!</h1>
            <p>Hi ${name},</p>
            <p>Your spot is confirmed! We're thrilled that you've registered for <strong>${event.title}</strong> and we can't wait to see you there.</p>
            <p>Get ready for an incredible opportunity to learn, connect with fellow innovators, and explore new ideas. We are putting together an engaging session filled with valuable insights and collaboration.</p>
            <p>We will send a detailed schedule and any other important information as the event date gets closer. In the meantime, feel free to connect with us on our social channels!</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h2 style="font-size: 20px; margin-top: 0; color: #333;">Event Details</h2>
              <p><strong>Event:</strong> ${event.title}</p>
              <p><strong>Date & Time:</strong> ${formattedDate}</p>
              <p><strong>Venue:</strong> ${event.venue?.locationName || 'To be announced'} (${event.venue?.type || ''})</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${googleCalendarLink}" target="_blank" style="background-color: #ff6600; color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Add to Google Calendar
              </a>
            </div>

            <p>Best Regards,<br/><strong>The Spark Club Team</strong></p>
          </div>
          <div style="background-color: #333; color: #fff; text-align: center; padding: 20px;">
            <p>Connect with us</p>
            <a href="https://www.instagram.com/spark_club_sati?igsh=MXhncDJmZ2t4Mmg0MA==" style="color: #fff; margin: 0 10px;">Instagram</a> | 
            <a href="https://chat.whatsapp.com/Gl8jd4Xz0jKAd9QUCDIVQ9" style="color: #fff; margin: 0 10px;">WhatsApp Community</a> | 
            <a href="https://www.sparkclubsati.vercel.app" style="color: #fff; margin: 0 10px;">Website</a>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Registration successful!' }, { status: 200 });

  } catch (error) {
    console.error('Registration failed:', error);
    return NextResponse.json({ message: 'Registration failed.', error: error.message }, { status: 500 });
  }
}