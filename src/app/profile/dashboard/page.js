import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { client } from '../../../../sanity/lib/client'; // Import Sanity client
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa'; // Import icons


async function getUserRegistrations() {
  const session = await getServerSession(authOptions);
  console.log('Dashboard Page Session:', session);

  if (!session || !session.user || !session.user.email) {
    // If not authenticated, redirect to login
    redirect('/login');
  }

  const userEmail = session.user.email;

  try {
    // First, find the user's profile ID based on their email
    const profile = await client.fetch(
      `*[_type == "profile" && userEmail == $userEmail][0]{
        _id
      }`,
      { userEmail }
    );

    if (!profile) {
      // If profile not found, it might be a new user, or an error
      // For now, return an empty array or handle as needed
      return []; 
    }

    const userProfileId = profile._id;

    // Fetch registrations and certificates in parallel
    const [registrations, certificates] = await Promise.all([
      client.fetch(
        `*[_type == "registration" && userProfile._ref == $userProfileId]{
          _id,
          registrationDate,
          event->{_id, title, "slug": slug.current, eventDate, venue{locationName, type}},
        }`,
        { userProfileId }
      ),
      client.fetch(
        `*[_type == "certificate" && userProfile._ref == $userProfileId]{
          _id,
          uniqueId,
          verificationUrl,
          "certificateFileUrl": certificateFile.asset->url,
          event->{_id} // Only need event ID to link with registrations
        }`,
        { userProfileId }
      )
    ]);

    // Create a map for quick lookup of certificates by event ID
    const certificatesByEventId = new Map();
    certificates.forEach(cert => {
      if (cert.event && cert.event._id) {
        certificatesByEventId.set(cert.event._id, cert);
      }
    });

    // Augment registrations with certificate data
    const augmentedRegistrations = registrations.map(reg => {
      const eventId = reg.event?._id;
      const certificate = eventId ? certificatesByEventId.get(eventId) : undefined;
      return {
        ...reg,
        certificate: certificate || null // Add certificate object or null if not found
      };
    });

    return augmentedRegistrations;
  } catch (error) {
    console.error('Error fetching user registrations and certificates:', error);
    return { error: error.message };
  }
}

export default async function DashboardPage() {
  const registrations = await getUserRegistrations();

  if (registrations.error) {
    return (
      <main className="bg-gray-50/50 backdrop-blur-sm py-12 md:py-20 min-h-screen">
        <div className="container mx-auto p-4 text-center text-red-600">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>{registrations.error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50/50 backdrop-blur-sm py-12 md:py-20 min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-black">My Events</h1>

        {registrations.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600">
            <p className="text-lg">You haven&apos;t registered for any events yet.</p>
            <Link href="/events" className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registrations.map((reg) => (
              <div key={reg._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-indigo-400">
                <h2 className="text-xl font-semibold text-black mb-2">{reg.event?.title || 'Unknown Event'}</h2>
                <p className="text-gray-700 text-sm mb-1 flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-500" /> <span className="font-medium">Registered On:</span> {new Date(reg.registrationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                {reg.event?.eventDate && (
                  <p className="text-gray-700 text-sm mb-1 flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-500" /> <span className="font-medium">Event Date:</span> {new Date(reg.event.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                )}
                {reg.event?.venue?.locationName && (
                  <p className="text-gray-700 text-sm mb-1 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-500" /> <span className="font-medium">Venue:</span> {reg.event.venue.locationName} {reg.event.venue.type && `(${reg.event.venue.type})`}
                  </p>
                )}
                {reg.event?.slug && (
                  <Link href={`/events/${reg.event.slug}`} className="mt-3 inline-block text-indigo-600 hover:underline text-sm">
                    View Event Details
                  </Link>
                )}
                {reg.certificate && (
                  <div className="mt-4 flex flex-col space-y-2">
                    {reg.certificate.certificateFileUrl && (
                      <a
                        href={reg.certificate.certificateFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        View Certificate
                      </a>
                    )}
                    {reg.certificate.uniqueId && (
                      <Link
                        href={`/verify-certificate/${reg.certificate.uniqueId}`}
                        className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Verify Certificate
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>


    </main>
  );
}