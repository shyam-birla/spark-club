import Link from 'next/link';
import Image from 'next/image';

const EventCard = ({ event }) => {
  // Date ko a-sān format mein dikhane ke liye
  const formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/events/${event.slug}`}>
      <div className="bg-gray-800 rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer h-full flex flex-col">
        <div className="relative w-full h-48">
          <Image
            src={event.imageUrl || '/placeholder.png'}
            alt={event.title}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-4 flex-grow">
          {event.status && (
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${event.status === 'upcoming' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          )}
          <h3 className="text-xl font-bold text-white mt-2">{event.title}</h3>
          <p className="text-orange-400 mt-1">{formattedDate}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;