import { client, urlFor } from '../../../../sanity/lib/client';
import Link from 'next/link';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { AddToCalendarButton } from 'add-to-calendar-button-react';
import EventRegistrationForm from '@/components/EventRegistrationForm';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import RegistrationStatus from '@/components/RegistrationStatus';


export async function generateStaticParams() {
  const slugs = await client.fetch(`*[_type == "event" && defined(slug.current)]{ "slug": slug.current }`);
  return slugs.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  // === YAHAN BADLAV KIYA GAYA HAI ===
  const { slug } = await params;
  const query = `*[_type == "event" && slug.current == $slug][0]{
    title,
    "description": pt::text(description)
  }`;
  const event = await client.fetch(query, { slug });

  if (!event) {
    return { title: "Event Not Found" };
  }

  return {
    title: `${event.title} | Spark Club Events`,
    description: event.description?.substring(0, 160) || `Join us for the ${event.title} event hosted by Spark Club.`,
  };
}

async function checkRegistration(email, eventId) {
    if (!email || !eventId) return false;
    const query = `count(*[_type == "registration" && email == $email && event._ref == $eventId])`;
    const count = await client.fetch(query, { email, eventId });
    return count > 0;
}

export default async function EventDetailPage({ params }) {
  // === YAHAN BHI BADLAV KIYA GAYA HAI ===
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  const eventQuery = `*[_type == "event" && slug.current == $slug][0]{
    _id, title, eventDate, description, "imageUrl": coverImage.asset->url, 
    venue, registrationLink, registrationStatus,
    speakers[]->{ _id, name, role, "imageUrl": image.asset->url },
    gallery
  }`;
  
  const event = await client.fetch(eventQuery, { slug });

  if (!event) {
    return <div className="text-center py-20">Event not found.</div>;
  }

  const isAlreadyRegistered = await checkRegistration(session?.user?.email, event._id);

  const formattedDate = new Date(event.eventDate).toLocaleString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const isUpcoming = new Date(event.eventDate) > new Date();

  return (
    <main className="bg-white container mx-auto px-4 py-12 md:py-20">
      {event.imageUrl && 
        <div className="relative w-full h-64 md:h-96 mb-8">
          <Image src={event.imageUrl} alt={event.title} fill className="object-cover rounded-lg shadow-lg" />
        </div>
      }
      
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">{event.title}</h1>
          <p className="text-lg text-gray-600">{formattedDate}</p>
        </div>
        <AddToCalendarButton
          name={event.title}
          startDate={new Date(event.eventDate).toISOString().split('T')[0]}
          startTime={new Date(event.eventDate).toTimeString().split(' ')[0]}
          endTime="18:00" // Placeholder
          timeZone="Asia/Kolkata"
          location={event.venue?.locationName || 'Check Details'}
          options={['Apple', 'Google', 'Outlook.com']}
          buttonStyle="round"
          light
        />
      </div>

      {event.description && (
        <div className="prose max-w-none text-lg text-gray-800 leading-relaxed mb-12">
          <PortableText value={event.description} />
        </div>
      )}

      {isUpcoming && (
        <div className="my-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-black">Join this Event!</h2>
          {event.venue && <p className="mb-6 text-black">📍 **Venue:** <a href={event.venue.locationUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-600 hover:underline">{event.venue.locationName} ({event.venue.type})</a></p>}
          
          <RegistrationStatus event={event} isAlreadyRegistered={isAlreadyRegistered} />
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

      {!isUpcoming && event.gallery && event.gallery.length > 0 && (
        <div className="my-12">
            <h2 className="text-3xl font-bold mb-6 text-black">Event Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {event.gallery.map((image, index) => (
                    <div key={index} className="relative w-full h-48">
                        {image && image.asset && (
                            <Image 
                                src={urlFor(image).url()} 
                                alt={`Event photo ${index + 1}`} 
                                fill 
                                className="rounded-lg object-cover" 
                            />
                        )}
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