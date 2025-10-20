import Image from 'next/image';

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
  // Pehle attendee ko alag se nikalenge taaki uska naam use kar sakein
  const firstAttendee = attendees[0]?.userProfile;
  // Baki bache hue logon ka count
  const othersCount = total - 1;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-lg mb-4">{total} Going</h3>
        
        {/* Profile pictures wala section (Hover functionality yahan se kaam karegi) */}
        <div className="flex flex-wrap -space-x-2">
            {displayedAttendees.map(attendee => (
                attendee.userProfile && (
                    <Image
                        key={attendee.userProfile._id}
                        src={attendee.userProfile.imageUrl || '/logo-black.png'}
                        alt={attendee.userProfile.userName || 'Attendee'}
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-white"
                        title={attendee.userProfile.userName} // Yeh line hover par naam dikhati hai
                    />
                )
            ))}
        </div>

        {/* --- NAYA TEXT SUMMARY SECTION --- */}
        {firstAttendee && (
            <p className="text-sm text-gray-600 mt-4">
                Joined by <strong className="text-black">{firstAttendee.userName}</strong>
                {othersCount > 0 && ` and ${othersCount} others`}
            </p>
        )}
    </div>
  );
}