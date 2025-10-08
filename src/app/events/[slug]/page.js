import { client, urlFor } from '../../../../sanity/lib/client';
import Link from 'next/link';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import RegistrationStatus from '@/components/RegistrationStatus';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaRegListAlt, FaStickyNote } from 'react-icons/fa';
import Attendees from '@/components/Attendees';
import { AddToCalendarButton } from 'add-to-calendar-button-react'; // <-- 1. IMPORT ADD KIYA

const eventQuery = `*[_type == "event" && slug.current == $slug][0]{
    _id, title, eventDate, description, "imageUrl": coverImage.asset->url, 
    venue, registrationLink, registrationStatus, schedule,
    speakers[]->{ _id, name, role, "imageUrl": image.asset->url },
    gallery,
    "registeredCount": count(*[_type == "registration" && references(^._id)]),
    "attendees": *[_type == "registration" && references(^._id) && defined(userProfile)]{
        userProfile->{ _id, userName, "imageUrl": userImage.asset->url }
    }[0...12]
}`;

async function checkRegistration(email, eventId) {
    if (!email || !eventId) return false;
    const query = `count(*[_type == "registration" && email == $email && event._ref == $eventId])`;
    const count = await client.fetch(query, { email, eventId });
    return count > 0;
}

export async function generateStaticParams() {
    const slugs = await client.fetch(`*[_type == "event" && defined(slug.current)]{ "slug": slug.current }`);
    return slugs.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const query = `*[_type == "event" && slug.current == $slug][0]{ title, "description": pt::text(description) }`;
    const event = await client.fetch(query, { slug });
    if (!event) return { title: "Event Not Found" };
    return {
        title: `${event.title} | Spark Club Events`,
        description: event.description?.substring(0, 160) || `Join us for the ${event.title} event.`,
    };
}

const KeyDetails = ({ event }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-black mb-8">
        <div className="flex items-center gap-2"><FaCalendar className="text-gray-500" /> <span>{new Date(event.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span></div>
        <div className="flex items-center gap-2"><FaClock className="text-gray-500" /> <span>{new Date(event.eventDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span></div>
        <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-gray-500" /> <span>{event.venue?.locationName || 'TBA'}</span></div>
    </div>
);

const EventSchedule = ({ schedule }) => (
    <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3"><FaRegListAlt /> Schedule</h2>
        <div className="space-y-6 border-l-2 border-gray-200 ml-3">
            {schedule.map((item, index) => (
                <div key={index} className="relative pl-8">
                    <div className="absolute -left-[7px] top-1 h-3 w-3 bg-orange-500 rounded-full border-2 border-white"></div>
                    <p className="font-bold text-sm text-orange-600">{item.time}</p>
                    <h4 className="font-semibold text-lg text-black">{item.activity}</h4>
                    {item.details && <p className="text-gray-600">{item.details}</p>}
                </div>
            ))}
        </div>
    </section>
);

export default async function EventDetailPage({ params }) {
    const { slug } = await params;
    const session = await getServerSession(authOptions);
    const event = await client.fetch(eventQuery, { slug });

    if (!event) { return <div className="text-center py-20">Event not found.</div>; }

    const isAlreadyRegistered = await checkRegistration(session?.user?.email, event._id);
    const isUpcoming = new Date(event.eventDate) > new Date();

    return (
        <main className="bg-gray-50/50 backdrop-blur-sm py-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    
                    <aside className="lg:col-span-1 space-y-6 lg:sticky top-24 self-start">
                        {event.imageUrl && (<div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg"><Image src={event.imageUrl} alt={event.title} fill className="object-cover" /></div>)}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"><h3 className="font-bold text-lg mb-2">Hosted By</h3><p>SPARK Community</p></div>
                        <Attendees attendees={event.attendees} total={event.registeredCount} />
                    </aside>

                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                            {/* --- 2. BUTTON KO YAHAN TITLE KE SAATH ADD KIYA GAYA HAI --- */}
                            <div className="flex justify-between items-start flex-wrap gap-4">
                                <h1 className="text-4xl md:text-5xl font-bold text-black">{event.title}</h1>
                                <AddToCalendarButton
                                    name={event.title}
                                    startDate={new Date(event.eventDate).toISOString().split('T')[0]}
                                    startTime={new Date(event.eventDate).toTimeString().split(' ')[0]}
                                    endTime="18:00"
                                    timeZone="Asia/Kolkata"
                                    location={event.venue?.locationName || 'Check Details'}
                                    options={['Apple', 'Google', 'Outlook.com']}
                                    buttonStyle="round"
                                    light
                                />
                            </div>
                            <div className="mt-6"> <KeyDetails event={event} /> </div>
                            {isUpcoming && (
                                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="font-semibold text-center mb-4 text-black">Welcome! To join the event, please register below.</p>
                                    <RegistrationStatus event={event} isAlreadyRegistered={isAlreadyRegistered} />
                                </div>
                            )}
                        </section>
                        
                        {event.description && (<section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm"><h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3"><FaStickyNote /> About this Event</h2><div className="prose max-w-none text-lg leading-relaxed"><PortableText value={event.description} /></div></section>)}
                        
                        {event.schedule && event.schedule.length > 0 && <EventSchedule schedule={event.schedule} />}

                        {event.speakers && event.speakers.length > 0 && (
                            <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                                <h2 className="text-2xl font-bold text-black mb-6">Speakers</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {event.speakers.map(speaker => (
                                        <div key={speaker._id} className="text-center">
                                            {speaker.imageUrl && <Image src={speaker.imageUrl} alt={speaker.name} width={100} height={100} className="rounded-full mx-auto mb-2 object-cover" />}
                                            <h3 className="font-bold text-black">{speaker.name}</h3>
                                            <p className="text-sm text-gray-600">{speaker.role}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {!isUpcoming && event.gallery && event.gallery.length > 0 && (
                             <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                                <h2 className="text-2xl font-bold text-black mb-6">Event Gallery</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {event.gallery.map((image, index) => (
                                        <div key={index} className="relative w-full h-48">
                                            {image && image.asset && ( <Image src={urlFor(image).url()} alt={`Event photo ${index + 1}`} fill className="rounded-lg object-cover" /> )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}