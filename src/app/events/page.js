import { client } from '../../../sanity/lib/client';
import EventCard from '@/components/EventCard';

// Nayi query jo categories aur unke upcoming events laayegi
const categoriesWithEventsQuery = `*[_type == "category"]{
    _id,
    title,
    "upcomingEvents": *[_type == "event" && references(^._id) && eventDate >= now()] | order(eventDate asc) {
        _id, title, eventDate, "slug": slug.current, "imageUrl": coverImage.asset->url, registrationStatus
    }
} | order(displayOrder asc)`;

// Query jo saare past events laayegi
const pastEventsQuery = `*[_type == "event" && eventDate < now()] | order(eventDate desc){
  _id, title, eventDate, "slug": slug.current, "imageUrl": coverImage.asset->url, registrationStatus
}`;

export default async function EventsPage() {
  const [categories, pastEvents] = await Promise.all([
    client.fetch(categoriesWithEventsQuery),
    client.fetch(pastEventsQuery)
  ]);

  // Sirf unhi categories ko rakho jinme aane waale events hain
  const categoriesWithEvents = categories.filter(cat => cat.upcomingEvents && cat.upcomingEvents.length > 0);

  return (
    // === YAHAN BADLAV KIYA GAYA HAI ===
    // Background ko main tag par lagaya
    <main className="bg-gray-50/50 backdrop-blur-sm py-12 md:py-20">
        {/* Content ko center mein rakhne ke liye naya container div */}
        <div className="container mx-auto px-4">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-2 text-black">Events</h1>
                <p className="text-gray-600 mb-12">Workshops, meetups, and hackathons hosted by SPARK.</p>
            </div>

            {/* Upcoming Events Section */}
            <section className="space-y-12">
                <h2 className="text-3xl font-bold text-black border-b pb-4">Upcoming Events</h2>
                {categoriesWithEvents.length > 0 ? (
                categoriesWithEvents.map((category) => (
                    <div key={category._id}>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-6">{category.title}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {category.upcomingEvents.map((event) => <EventCard key={event._id} event={event} />)}
                        </div>
                    </div>
                ))
                ) : (
                <div className="text-center py-16 bg-white/50 rounded-lg">
                    <p className="text-xl text-gray-500">No upcoming events right now. Stay tuned!</p>
                </div>
                )}
            </section>

            {/* Past Events Section */}
            <section className="mt-20">
                <h2 className="text-3xl font-bold text-black border-b pb-4 mb-8">Past Events</h2>
                {pastEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pastEvents.map((event) => <EventCard key={event._id} event={event} />)}
                </div>
                ) : (
                <div className="text-center py-16 bg-white/50 rounded-lg">
                    <p className="text-xl text-gray-500">No past events to show.</p>
                </div>
                )}
            </section>
        </div>
    </main>
  );
}