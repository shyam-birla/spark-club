import { client } from '../../../../sanity/lib/client';
import Link from 'next/link';
import Image from 'next/image';

// Ek single event fetch karne ke liye GROQ query
const eventQuery = `*[_type == "event" && slug.current == $slug][0]{
  _id,
  title,
  eventDate,
  description,
  "imageUrl": coverImage.asset->url,
  status
}`;

export default async function EventDetailPage({ params }) {
  const { slug } = params;
  const event = await client.fetch(eventQuery, { slug });

  if (!event) {
    return <div>Event not found.</div>;
  }

  // Date ko a-sān format mein dikhane ke liye
  const formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <main className="bg-black container mx-auto px-4 py-20 text-white">
      {/* Cover Image */}
      {event.imageUrl && (
        <div className="relative w-full h-96 mb-8">
          <Image 
            src={event.imageUrl} 
            alt={event.title} 
            layout="fill"
            objectFit="cover"
            className="rounded-lg" 
          />
        </div>
      )}
      
      {/* Status Badge and Date */}
      <div className="flex items-center gap-4 mb-4">
        {event.status && (
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${event.status === 'upcoming' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        )}
        <p className="text-lg text-orange-400">{formattedDate}</p>
      </div>

      {/* Event Title */}
      <h1 className="text-4xl md:text-6xl font-bold mb-6">{event.title}</h1>
      
      {/* Event Description */}
      {event.description && (
        <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
          <p>{event.description}</p>
        </div>
      )}

      {/* Back to Events Link */}
      <div className="mt-12">
        <Link href="/events">
          <button className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-md">
            ← Back to All Events
          </button>
        </Link>
      </div>
    </main>
  );
}