import { NextResponse } from 'next/server';
import { client } from '../../../../sanity/lib/client';
import { Resend } from 'resend';
import { revalidatePath } from 'next/cache';

// Likhne ke liye special client (write token ke saath)
const writeClient = client.withConfig({
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  ignoreBrowserTokenWarning: true,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const formData = await request.formData(); // Use request.formData() to parse multipart/form-data

    const eventId = formData.get('eventId');
    const userEmail = formData.get('userEmail');
    const name = formData.get('name');
    const email = formData.get('email');
    const mobileNo = formData.get('mobileNo');
    const collegeName = formData.get('collegeName');
    const honeypot = formData.get('honeypot');

    if (!eventId || !name || !email || !mobileNo || !collegeName) {
      return NextResponse.json({ error: 'Missing required form data.' }, { status: 400 });
    }

    // 1. Spam Protection (Honeypot)
    if (honeypot) {
      return NextResponse.json({ message: 'Registration successful!' }, { status: 200 });
    }

    // 2. Duplicate Registration Check
    const existingRegistration = await client.fetch(
      `*[_type == "registration" && email == $email && event._ref == $eventId][0]`,
      { email: email, eventId }
    );

    if (existingRegistration) {
      return NextResponse.json({ message: 'You are already registered for this event.' }, { status: 409 });
    }

    // 3. User ki Profile Dhoondhna (agar logged in hai)
    let userProfileRef = null;
    if (userEmail) {
      const profile = await client.fetch(
        `*[_type == "profile" && userEmail == $email][0]{ _id }`,
        { email: userEmail }
      );
      if (profile) {
        userProfileRef = { _type: 'reference', _ref: profile._id };
      }
    }

    // 4. Process Custom Fields and File Uploads
    const customDataFields = [];
    for (const [key, value] of formData.entries()) {
      // Skip standard fields and internal fields
      if (['eventId', 'userEmail', 'name', 'email', 'mobileNo', 'collegeName', 'honeypot'].includes(key)) {
        continue;
      }

      if (value instanceof File) {
        // Handle file upload
        if (value.size === 0) { // Check for empty file
          console.warn(`Skipping empty file for custom field: ${key}`);
          continue;
        }
        try {
          const asset = await writeClient.assets.upload('file', value, {
            filename: value.name,
            contentType: value.type,
          });
          customDataFields.push({
            _key: key,
            _type: 'object',
            key: key,
            value: {
              _type: 'file',
              asset: {
                _type: 'reference',
                _ref: asset._id,
              },
            },
          });
        } catch (uploadError) {
          console.error(`Error uploading file for custom field ${key}:`, uploadError);
          // Decide how to handle upload errors: skip, return error, etc.
          // For now, we'll just push a string indicating failure
          customDataFields.push({
            _key: key,
            _type: 'object',
            key: key,
            value: `File upload failed: ${uploadError.message}`,
          });
        }
      } else {
        // Handle non-file custom fields
        customDataFields.push({
          _key: key,
          _type: 'object',
          key: key,
          value: String(value),
        });
      }
    }

    // 5. Naya Registration Document Taiyar Karna
    const registrationDoc = {
      _type: 'registration',
      name,
      email,
      mobileNo,
      collegeName,
      userProfile: userProfileRef,
      event: { _type: 'reference', _ref: eventId },
      registrationDate: new Date().toISOString(),
      customData: {
        _type: 'object',
        fields: customDataFields,
      },
    };

    // 6. Sanity mein Document Create Karna
    await writeClient.create(registrationDoc);

    // 7. Confirmation Email Bhejna
    const event = await client.fetch(`*[_type == "event" && _id == $eventId][0]`, { eventId });
    if (!event) throw new Error("Event not found for sending email.");

    const eventDate = new Date(event.eventDate);
    const formattedDate = eventDate.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });
    const startTime = eventDate.toISOString().replace(/-|:|\.\d\d\d/g,"");
    const endTime = new Date(eventDate.getTime() + (2*60*60*1000)).toISOString().replace(/-|:|\.\d\d\d/g,"");
    const googleCalendarLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description?.[0]?.children?.[0]?.text || 'See you there!')}&location=${encodeURIComponent(event.venue?.locationName || 'Check website for details')}`;
    
    await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `✅ Confirmation: You're registered for ${event.title}!`,
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;"><div style="background-color: #f4f4f4; padding: 20px; text-align: center;"><img src="https://sparkcommunity.vercel.app/logo.png" alt="Spark community Logo" style="max-width: 150px;"></div><div style="padding: 20px; line-height: 1.6; color: #333;"><h1 style="color: #000; font-size: 24px;">Registration Confirmed!</h1><p>Hi ${name},</p><p>Your spot is confirmed! We're thrilled that you've registered for <strong>${event.title}</strong> and we can't wait to see you there.</p><p>Get ready for an incredible opportunity to learn, connect with fellow innovators, and explore new ideas. We are putting together an engaging session filled with valuable insights and collaboration.</p><p>We will send a detailed schedule and any other important information as the event date gets closer. In the meantime, feel free to connect with us on our social channels!</p><div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;"><h2 style="font-size: 20px; margin-top: 0; color: #333;">Event Details</h2><p><strong>Event:</strong> ${event.title}</p><p><strong>Date & Time:</strong> ${formattedDate}</p><p><strong>Venue:</strong> ${event.venue?.locationName || 'To be announced'} (${event.venue?.type || ''})</p></div><div style="text-align: center; margin: 30px 0;"><a href="${googleCalendarLink}" target="_blank" style="background-color: #ff6600; color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Add to Google Calendar</a></div><p>Best Regards,<br/><strong>The Spark Community Team</strong></p></div><div style="background-color: #333; color: #fff; text-align: center; padding: 20px;"><p>Connect with us</p><a href="https://www.instagram.com/_.spark.tech_" style="color: #fff; margin: 0 10px;">Instagram</a> | <a href="https://chat.whatsapp.com/Gl8jd4Xz0jKAd9QUCDIVQ9" style="color: #fff; margin: 0 10px;">WhatsApp Community</a> | <a href="https://sparkcommunity.vercel.app" style="color: #fff; margin: 0 10px;">Website</a></div></div>`,
    });

    // Revalidate the event detail page to show updated registration status and attendees
    revalidatePath(`/events/${event.slug.current}`);

    return NextResponse.json({ message: 'Registration successful!' }, { status: 200 });

  } catch (error) {
    console.error('Error creating registration in Sanity:', error);
    const errorMessage = error.responseBody ? JSON.parse(error.responseBody).error.description : 'Failed to create registration.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
