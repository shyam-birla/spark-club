// src/app/events/[slug]/page.js
'use client'; // "Add to Calendar" button ke liye zaroori hai
import { client } from '../../../../sanity/lib/client';
import Link from 'next/link';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { AddToCalendarButton } from 'add-to-calendar-button-react';
import { useEffect, useState } from 'react';
import EventRegistrationForm from '@/components/EventRegistrationForm'; // Apne form ko import karein

// Nayi query jo saara data fetch karegi
const eventQuery = `*[_type == "event" && slug.current == $slug][0]{
  _id, title, eventDate, description, "imageUrl": coverImage.asset->url, status,
  venue, registrationLink,
  speakers[]->{ _id, name, role, "imageUrl": image.asset->url },
  gallery
}`;

export default function EventDetailPage({ params }) {
  const [event, setEvent] = useState(null);
  
  useEffect(() => {
    const fetchEvent = async () => {
      const eventData = await client.fetch(eventQuery, { slug: params.slug });
      setEvent(eventData);
    };
    fetchEvent();
  }, [params.slug]);

  if (!event) return <div>Loading...</div>;

  const formattedDate = new Date(event.eventDate).toLocaleString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <main className="bg-black container mx-auto px-4 py-20 text-white">
      {/* Cover Image */}
      {event.imageUrl && <div className="relative w-full h-96 mb-8"><Image src={event.imageUrl} alt={event.title} layout="fill" objectFit="cover" className="rounded-lg" /></div>}
      
      {/* Title, Date, Calendar Button */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{event.title}</h1>
          <p className="text-lg text-orange-400 mb-4">{formattedDate}</p>
        </div>
        <AddToCalendarButton
          name={event.title}
          startDate={new Date(event.eventDate).toISOString().split('T')[0]}
          startTime={new Date(event.eventDate).toTimeString().split(' ')[0]}
          endTime="18:00"
          timeZone="Asia/Kolkata"
          location={event.venue?.locationName || 'Check Details'}
          options={['Apple', 'Google', 'Outlook.com']}
          buttonStyle="round"
          light
        />
      </div>

      {/* Rich Text Description */}
      <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed mb-8">
        <PortableText value={event.description} />
      </div>

      {/* Dynamic CTA (Register Button) & Venue Info */}
      {event.status === 'upcoming' && (
        <div className="my-12 p-6 bg-gray-900 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Join this Event!</h2>
          {event.venue && <p className="mb-4">📍 **Venue:** <a href={event.venue.locationUrl} target="_blank" className="text-orange-400 hover:underline">{event.venue.locationName} ({event.venue.type})</a></p>}
          <EventRegistrationForm eventTitle={event.title} />
        </div>
      )}

      {/* Speakers Section */}
      {event.speakers && event.speakers.length > 0 && (
        <div className="my-12">
          <h2 className="text-3xl font-bold mb-6">Speakers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {event.speakers.map(speaker => (
              <div key={speaker._id} className="text-center">
                {speaker.imageUrl && <Image src={speaker.imageUrl} alt={speaker.name} width={100} height={100} className="rounded-full mx-auto mb-2" />}
                <h3 className="font-bold">{speaker.name}</h3>
                <p className="text-sm text-gray-400">{speaker.role}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo Gallery for Past Events */}
      {event.status === 'past' && event.gallery && (
        <div className="my-12">
          <h2 className="text-3xl font-bold mb-6">Event Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {event.gallery.map((image, index) => (
              <Image key={index} src={client.imageBuilder.image(image).url()} alt={`Event photo ${index + 1}`} width={400} height={400} className="rounded-lg object-cover" />
            ))}
          </div>
        </div>
      )}

      {/* Back to Events Link */}
      <div className="mt-12"><Link href="/events"><button className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-md">← Back to All Events</button></Link></div>
    </main>
  );
}