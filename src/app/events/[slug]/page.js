import { client } from '../../../../sanity/lib/client';
import Link from 'next/link';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { AddToCalendarButton } from 'add-to-calendar-button-react';
import EventRegistrationForm from '@/components/EventRegistrationForm';

// Naya Function: Yeh Next.js ko batata hai ki kaun kaun se slugs hain
export async function generateStaticParams() {
  const slugs = await client.fetch(`*[_type == "event" && defined(slug.current)]{ "slug": slug.current }`);
  // Yeh is format mein data dega: [{ slug: 'event-1' }, { slug: 'event-2' }]
  return slugs;
}

const eventQuery = `*[_type == "event" && slug.current == $slug][0]{
  _id, 
  title, 
  eventDate, 
  description, 
  "imageUrl": coverImage.asset->url, 
  status,
  venue,
  registrationLink,
  speakers[]->{ _id, name, role, "imageUrl": image.asset->url },
  gallery
}`;

export default async function EventDetailPage({ params: { slug } }) {
  const event = await client.fetch(eventQuery, { slug });

  if (!event) {
    return <div className="text-center py-20">Event not found.</div>;
  }

  const formattedDate = new Date(event.eventDate).toLocaleString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <main className="bg-white container mx-auto px-4 py-20">
      {event.imageUrl && 
        <div className="relative w-full h-96 mb-8">
          <Image src={event.imageUrl} alt={event.title} fill className="object-cover rounded-lg" />
        </div>
      }
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-black">{event.title}</h1>
          <p className="text-lg text-gray-600">{formattedDate}</p>
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

      {event.description && (
         <div className="prose max-w-none text-lg leading-relaxed mb-8">
            <PortableText value={event.description} />
         </div>
      )}

      {event.status === 'upcoming' && (
        <div className="my-12 p-6 bg-gray-100 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-black">Join this Event!</h2>
          {event.venue && <p className="mb-4 text-black">📍 **Venue:** <a href={event.venue.locationUrl} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">{event.venue.locationName} ({event.venue.type})</a></p>}
          
          {event.registrationLink ? (
             <Link href={event.registrationLink} target="_blank">
               <button className="w-full bg-black text-white px-6 py-3 rounded-md font-semibold text-lg hover:opacity-80 transition-opacity">
                   Register Here (External Link)
               </button>
             </Link>
          ) : (
             <EventRegistrationForm eventTitle={event.title} eventId={event._id} />
          )}
        </div>
      )}

      {event.speakers && event.speakers.length > 0 && (
        <div className="my-12">
          <h2 className="text-3xl font-bold mb-6 text-black">Speakers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {event.speakers.map(speaker => (
              <div key={speaker._id} className="text-center">
                {speaker.imageUrl && <Image src={speaker.imageUrl} alt={speaker.name} width={100} height={100} className="rounded-full mx-auto mb-2 object-cover" />}
                <h3 className="font-bold text-black">{speaker.name}</h3>
                <p className="text-sm text-gray-600">{speaker.role}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {event.status === 'past' && event.gallery && event.gallery.length > 0 && (
        <div className="my-12">
          <h2 className="text-3xl font-bold mb-6 text-black">Event Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {event.gallery.map((image, index) => (
              <div key={index} className="relative w-full h-48">
                <Image src={client.imageBuilder.image(image).url()} alt={`Event photo ${index + 1}`} fill className="rounded-lg object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12">
        <Link href="/events">
          <button className="bg-gray-200 text-black hover:bg-gray-300 px-6 py-3 rounded-md transition-colors">← Back to All Events</button>
        </Link>
      </div>
    </main>
  );
}