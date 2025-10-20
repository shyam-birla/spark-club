import Image from 'next/image';

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
    className="rounded-full border-2 border-white bg-gray-300 flex items-center justify-center"
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
            <h3 className="font-bold text-lg mb-4">Attendees</h3>
            <p className="text-sm text-gray-500">Be the first one to register!</p>
        </div>
    );
  }

  const displayedAttendees = attendees.slice(0, 12);
  const firstAttendeeName = attendees[0]?.name;
  const othersCount = total - displayedAttendees.length;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-lg mb-4">{total} Going</h3>
        
        <div className="flex flex-wrap -space-x-2">
            {displayedAttendees.map(attendee => (
                attendee.imageUrl ? (
                    <Image
                        key={attendee._key}
                        src={attendee.imageUrl}
                        alt={attendee.name || 'Attendee'}
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-white"
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
                {othersCount > 0 && ` and ${othersCount} others`}
            </p>
        )}
    </div>
  );
}
