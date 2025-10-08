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

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-lg mb-4">{total}+ Going</h3>
        <div className="flex flex-wrap -space-x-2">
            {displayedAttendees.map(attendee => (
                attendee.userProfile && (
                    <Image
                        key={attendee.userProfile._id}
                        src={attendee.userProfile.imageUrl || '/logo-black.png'} // Add a default avatar in /public
                        alt={attendee.userProfile.userName || 'Attendee'}
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-white"
                        title={attendee.userProfile.userName}
                    />
                )
            ))}
        </div>
    </div>
  );
}