import { client, urlFor } from '../../../../sanity/lib/client';
import Link from 'next/link';
import Image from 'next/image';
import PortableTextComponent from '@/components/PortableTextComponent';
import RegistrationStatus from '@/components/RegistrationStatus';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaRegListAlt, FaStickyNote, FaMicrophone } from 'react-icons/fa';
import Attendees from '@/components/Attendees';
import AddToCalendar from '@/components/AddToCalendar';
import dynamic from 'next/dynamic';
const ImageGalleryWithLightbox = dynamic(() => import('@/components/ImageGalleryWithLightbox'), {
    loading: () => <div className="h-64 w-full animate-pulse bg-gray-200 rounded-md"></div>
});
import Collaborators from '@/components/Collaborators';
import HostedBy from '@/components/HostedBy';
import SocialShare from '@/components/SocialShare';
import DynamicCountdownTimer from '@/components/DynamicCountdownTimer';
import EventFeedbackForm from '@/components/EventFeedbackForm';
const RelatedEvents = dynamic(() => import('@/components/RelatedEvents'), {
    loading: () => <div className="h-40 w-full animate-pulse bg-gray-200 rounded-md"></div>
});

// === YAHAN QUERY UPDATE KI GAYI HAI ===
const eventQuery = `*[_type == "event" && slug.current == $slug][0]{
    _id, title, eventDate, endDate, description, "imageUrl": coverImage.asset->url, 
    venue{ type, locationName, locationUrl }, registrationLink, registrationStatus, schedule,
    speakers[]->{ _id, name, role, "imageUrl": image.asset->url },
    hostedBy[]{
      name,
      "logoUrl": logo.asset->url
    },
    categories[]->{_id, title},
    gallery,
    youtubeLinks,
    mainEventRecording,
    "registeredCount": count(*[_type == "registration" && references(^._id)]),
    "attendees": *[_type == "registration" && references(^._id)]{
        _key,
        ...userProfile->{
            "name": userName,
            "imageUrl": userImage.asset->url
        },
        ...select(userProfile == null => {
            "name": name
        })
    }[0...12],
    collaborators[]{
      name,
      "logoUrl": logo.asset->url
    },
    "isRegistered": count(*[_type == "registration" && event._ref == ^._id && email == $userEmail]) > 0,
    
    // customRegistrationFields ko _key aur name.current ke saath fetch kiya
    customRegistrationFields[]{
      _key, // React key prop ke liye
      label,
      "name": name.current, // Object ki jagah string
      type,
      required,
      options,
      placeholder,
      allowedFileTypes
    },
    "hasSubmittedFeedback": count(*[_type == "eventFeedback" && event._ref == ^._id && userProfile._ref in *[_type=="profile" && userEmail==$userEmail]._id]) > 0
}`;
// === END OF QUERY UPDATE ===

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



const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    try {
        const urlObj = new URL(url);
        let videoId = null;
        if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
            videoId = urlObj.searchParams.get('v');
        } else if (urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.slice(1);
        }
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) {
        console.error("Invalid URL for YouTube embed:", error);
        return '';
    }
    return url;
};

const toPlainText = (blocks) => {
    if (!blocks || blocks.length === 0) {
        return '';
    }
    return blocks
        .map(block => {
            if (block._type !== 'block' || !block.children) {
                return '';
            }
            return block.children.map(child => child.text).join('');
        })
        .join('\n\n');
};

const KeyDetails = ({ event }) => {
    const startDate = new Date(event.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'Asia/Kolkata' });
    const endDate = event.endDate ? new Date(event.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'Asia/Kolkata' }) : null;
    const dateDisplay = endDate && startDate !== endDate ? `${startDate} - ${endDate}` : startDate;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-black mb-8">
            <div className="flex items-center gap-2"><FaCalendar className="text-gray-500" /> <span>{dateDisplay}</span></div>
            <div className="flex items-center gap-2"><FaClock className="text-gray-500" /> <span>{new Date(event.eventDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })}</span></div>
            <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-gray-500" /> <span>{event.venue?.locationUrl ? <a href={event.venue.locationUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">{event.venue.locationName}</a> : event.venue?.locationName || 'TBA'}</span></div>
        </div>
    );
};

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
    const event = await client.fetch(eventQuery, { slug, userEmail: session?.user?.email }, { next: { revalidate: 600 } });

    if (!event) {
        return (
            <main className="bg-gray-50/50 backdrop-blur-sm py-12 md:py-20 min-h-screen">
                <div className="container mx-auto p-4 text-center text-red-600 bg-white rounded-lg shadow-md py-8">
                    <h1 className="text-3xl font-bold mb-4">ERROR 404: Event Not Found!</h1>
                    <p className="text-lg mb-4">My apologies, human. It seems the event you&apos;re looking for has gone rogue or never existed in this dimension.</p>
                    <p className="text-sm text-gray-700 mt-2">Initiating quantum search protocols... (Just kidding, double-check the URL. If that fails, the event might be a myth!)</p>
                </div>
            </main>
        );
    }

    const isAlreadyRegistered = event.isRegistered;
    const isUpcoming = new Date(event.endDate || event.eventDate) > new Date();


    // Fetch feedback data separately
    const feedbackData = await client.fetch(
        `*[_type == "eventFeedback" && event._ref == $eventId]{
            rating
        }`,
        { eventId: event._id }
    );

    const feedbackCount = feedbackData.length;
    const averageRating = feedbackCount > 0 
        ? (feedbackData.reduce((sum, fb) => sum + fb.rating, 0) / feedbackCount).toFixed(1)
        : 0;

    return (
        <main className="bg-gray-50/50 backdrop-blur-sm py-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
                    <aside className="lg:col-span-1 space-y-6 lg:sticky top-24 self-start">
                        {event.imageUrl && (<div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg"><Image src={event.imageUrl} alt={event.title} fill className="object-cover" priority={true} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" /></div>)}
                        <HostedBy hosts={event.hostedBy} />
                        <Collaborators collaborators={event.collaborators} />
                        <Attendees attendees={event.attendees} total={event.registeredCount} />
                    </aside>

                    <div className="lg:col-span-3 space-y-8">
                        <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold text-black">{event.title}</h1>
                                {event.categories && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {event.categories.map((category) => (
                                            <span key={category.title} className="bg-orange-100 text-orange-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                                                {category.title}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="mt-6"> <KeyDetails event={event} /> </div>
                            <div className="mb-4">
                                <AddToCalendar event={event} plainDescription={toPlainText(event.description)} />
                                <SocialShare url={`https://sparkcommunity.vercel.app/events/${slug}`} title={event.title} />
                            </div>
                            {isUpcoming && (
                                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex justify-center mb-4">
                                        <DynamicCountdownTimer date={event.eventDate} />
                                    </div>
                                    <p className="font-semibold text-center mb-4 text-black">Welcome! To join the event, please register below.</p>
                                    <RegistrationStatus event={event} isAlreadyRegistered={isAlreadyRegistered} />
                                </div>
                            )}
                        </section>

                

                        {event.description && (<section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm"><h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3"><FaStickyNote /> About this Event</h2><div className="prose max-w-none text-lg leading-relaxed"><PortableTextComponent value={event.description} /></div></section>)}

                        {event.mainEventRecording && getYouTubeEmbedUrl(event.mainEventRecording) && (
                            <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                                <h2 className="text-2xl font-bold text-black mb-6">Event Recording</h2>
                                <div className="relative w-full" style={{paddingBottom: "56.25%"}}>
                                    <iframe
                                        className="absolute top-0 left-0 w-full h-full"
                                        src={getYouTubeEmbedUrl(event.mainEventRecording)}
                                        title="Event Recording"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        loading="lazy"
                                    ></iframe>
                                </div>
                            </section>
                        )}
                        
                        {event.schedule && event.schedule.length > 0 && <EventSchedule schedule={event.schedule} />}

                        {event.speakers && event.speakers.length > 0 && (
                            <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                                <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3"><FaMicrophone /> Speakers</h2>
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

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {!isUpcoming && event.gallery && event.gallery.length > 0 && (
                                <ImageGalleryWithLightbox gallery={event.gallery} />
                            )}
                            {!isUpcoming && event.youtubeLinks && event.youtubeLinks.length > 0 && (
                                <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                                    <h2 className="text-2xl font-bold text-black mb-6">Event Videos</h2>
                                    <div className="grid grid-cols-1 gap-4">
                                        {event.youtubeLinks.map((videoUrl, index) => {
                                            const embedUrl = getYouTubeEmbedUrl(videoUrl);
                                            if (!embedUrl) return null;

                                            return (
                                                <div key={index} className="relative w-full" style={{paddingBottom: "56.25%"}}>
                                                    <iframe
                                                        className="absolute top-0 left-0 w-full h-full"
                                                        src={embedUrl}
                                                        title={`Event video ${index + 1}`}
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                        loading="lazy"
                                                    ></iframe>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}
                        </div>

                        <RelatedEvents currentEventId={event._id} categories={event.categories} />

                        {!isUpcoming && session?.user && (
                            <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                                <h2 className="text-2xl font-bold text-black mb-6">Feedback</h2>
                                {event.hasSubmittedFeedback ? (
                                    <p>You have already submitted feedback for this event. Thank you!</p>
                                ) : (
                                    <EventFeedbackForm eventId={event._id} userEmail={session.user.email} />
                                )}
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}