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
      {/* Card ko light theme ke liye update kiya */}
      <div className="bg-white rounded-lg overflow-hidden transition-all duration-300 cursor-pointer h-full flex flex-col border border-gray-200 hover:shadow-xl hover:scale-105 transform">
        <div className="relative w-full h-48">
          {/* Image component ko naye syntax ke hisaab se update kiya */}
          <Image
            src={event.imageUrl || '/placeholder.png'}
            alt={event.title}
            fill
            className="object-cover"
            unoptimized={event.imageUrl ? false : true}
          />
        </div>
        <div className="p-4 flex-grow">
          {event.status && (
            // Status badge ko light theme ke liye update kiya (Recommended Option B)
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${event.status === 'upcoming' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          )}
          {/* Text ko light theme ke liye update kiya */}
          <h3 className="text-xl font-bold text-black mt-2">{event.title}</h3>
          <p className="text-gray-600 mt-1">{formattedDate}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;