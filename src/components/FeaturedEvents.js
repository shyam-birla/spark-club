import Link from 'next/link';
import EventCard from './EventCard';

const FeaturedEvents = ({ events }) => {
  if (!events || events.length === 0) {
    return null; // Don't render the section if there are no upcoming events
  }

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Upcoming Events</h2>
          <Link href="/events">
            <button className="bg-orange-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-orange-600 transition-colors">
              View All
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
