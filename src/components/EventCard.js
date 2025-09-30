// src/components/EventCard.js
import Link from 'next/link';
import Image from 'next/image';

const EventCard = ({ event }) => {
  const formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Nayi status ke liye color logic
  const getStatusClass = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'comingSoon':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link href={`/events/${event.slug}`}>
      <div className="bg-white rounded-lg overflow-hidden transition-all duration-300 cursor-pointer h-full flex flex-col border border-gray-200 hover:shadow-xl hover:scale-105 transform">
        <div className="relative w-full h-48">
          <Image
            src={event.imageUrl || '/placeholder.png'}
            alt={event.title}
            fill
            className="object-cover"
            unoptimized={!event.imageUrl}
          />
        </div>
        <div className="p-4 flex-grow flex flex-col">
          {event.registrationStatus && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full self-start ${getStatusClass(event.registrationStatus)}`}>
              {event.registrationStatus === 'comingSoon' ? 'Coming Soon' : event.registrationStatus.charAt(0).toUpperCase() + event.registrationStatus.slice(1)}
            </span>
          )}
          <h3 className="text-xl font-bold text-black mt-2">{event.title}</h3>
          <p className="text-gray-600 mt-1 flex-grow">{formattedDate}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;