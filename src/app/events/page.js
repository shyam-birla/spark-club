// src/app/events/page.js
import { client } from '../../../sanity/lib/client';
import EventCard from '@/components/EventCard';

const eventsQuery = `*[_type == "event"] | order(eventDate desc){
  _id, title, eventDate, "slug": slug.current, "imageUrl": coverImage.asset->url, status
}`;

export default async function EventsPage() {
  const events = await client.fetch(eventsQuery);
  
  // Events ko upcoming aur past mein filter karein
  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  const pastEvents = events.filter(event => event.status === 'past');

  return (
    <main className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-2">Events</h1>
      <p className="text-gray-400 mb-12">Workshops, meetups, and hackathons.</p>

      {/* Upcoming Events Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-orange-400">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => <EventCard key={event._id} event={event} />)}
          </div>
        ) : (
          <p className="text-gray-500">No upcoming events right now. Stay tuned!</p>
        )}
      </section>

      {/* Past Events Section */}
      <section className="mt-20">
        <h2 className="text-3xl font-bold mb-8 text-gray-400">Past Events</h2>
        {pastEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event) => <EventCard key={event._id} event={event} />)}
          </div>
        ) : (
          <p className="text-gray-500">No past events to show.</p>
        )}
      </section>
    </main>
  );
}