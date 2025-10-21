import Image from 'next/image';
import { FaUsers } from 'react-icons/fa';

const getInitials = (name) => {
  if (!name) return '';
  const nameParts = name.split(' ');
  if (nameParts.length > 1) {
    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
  }
  return `${nameParts[0][0]}`.toUpperCase();
};

const FallbackImage = ({ name }) => (
  <div
    className="rounded-full border-2 border-white bg-gray-300 flex items-center justify-center hover:scale-110 transition-transform duration-200"
    style={{ width: 40, height: 40 }}
    title={name}
  >
    <span className="text-white font-bold">{getInitials(name)}</span>
  </div>
);

export default function Attendees({ attendees, total }) {
  if (!attendees || total === 0) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><FaUsers /> <span className="text-2xl font-extrabold text-black">{total}+</span> Attendees are coming in this event</h3>
            <p className="text-sm text-gray-500">Join the fun! Be the first one to register.</p>
        </div>
    );
  }

  const displayedAttendees = attendees.slice(0, 12);
  const firstAttendeeName = attendees[0]?.name;
  const othersCount = total - displayedAttendees.length;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><FaUsers /> <span className="text-2xl font-extrabold text-black">{total}+</span> Attendees are coming in this event</h3>
        
        <div className="flex flex-wrap -space-x-2">
            {displayedAttendees.map(attendee => (
                attendee.imageUrl ? (
                    <Image
                        key={attendee._key}
                        src={attendee.imageUrl}
                        alt={attendee.name || 'Attendee'}
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-white hover:scale-110 transition-transform duration-200"
                        title={attendee.name}
                    />
                ) : (
                    <FallbackImage key={attendee._key} name={attendee.name} />
                )
            ))}
        </div>

        {firstAttendeeName && (
            <p className="text-sm text-gray-600 mt-4">
                Joined by <strong className="text-black">{firstAttendeeName}</strong>
                {total > 1 && ` and ${total - 1} other${total - 1 > 1 ? 's' : ''}`}
            </p>
        )}
    </div>
  );
}