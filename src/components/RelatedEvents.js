'use client';

import { client } from '../../sanity/lib/client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const RelatedEvents = ({ currentEventId, categories }) => {
  const [relatedEvents, setRelatedEvents] = useState([]);

  useEffect(() => {
    if (categories && categories.length > 0) {
      const categoryIds = categories.map(c => c._id);
      const query = `*[_type == "event" && _id != $currentEventId && count(categories[@._ref in $categoryIds]) > 0][0...3]{
        _id,
        title,
        slug,
        "imageUrl": coverImage.asset->url
      }`;

      client.fetch(query, { currentEventId, categoryIds }).then(events => {
        setRelatedEvents(events);
      });
    }
  }, [currentEventId, categories]);

  if (relatedEvents.length === 0) {
    return null;
  }

  return (
    <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm mt-8">
      <h2 className="text-2xl font-bold text-black mb-6">Related Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedEvents.map(event => (
          <Link key={event._id} href={`/events/${event.slug.current}`}>
            <a className="group">
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  layout="fill"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-bold text-black mt-4 group-hover:text-orange-600">{event.title}</h3>
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedEvents;
