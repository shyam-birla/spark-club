import { client } from '../../../sanity/lib/client';
import EventCard from '@/components/EventCard'; // Hum yeh component abhi banayenge

// Sabhi events ko date ke hisab se sort karke fetch karne ke liye query
const eventsQuery = `*[_type == "event"] | order(eventDate desc){
  _id,
  title,
  eventDate,
  "slug": slug.current,
  "imageUrl": coverImage.asset->url,
  status
}`;

export default async function EventsPage() {
  const events = await client.fetch(eventsQuery);

  return (
    <main className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-2">Events</h1>
      <p className="text-gray-400 mb-12">Workshops, meetups, and hackathons.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </main>
  );
}