'use client';
import Link from 'next/link';
import EventCard from './EventCard';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const FeaturedEvents = ({ events }) => {
  const [itemsToDisplay, setItemsToDisplay] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let limit = events.length; // Default to all items from prop

      if (width < 768) { // Mobile
        limit = 2;
      } else if (width >= 768 && width < 1024) { // Laptop (md breakpoint)
        limit = 3;
      } else { // Large Desktop (lg breakpoint and above)
        limit = 3;
      }
      setItemsToDisplay(events.slice(0, limit));
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [events]); // Depend on 'events' prop

  if (!events || events.length === 0) return null;

  const containerVariants = { /* ...variants... */ };
  const cardVariants = { /* ...variants... */ };

  return (
    <section className="py-20 bg-gray-50/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-black">Upcoming Events</h2>
          <Link href="/events">
            <button className="bg-black text-white px-6 py-2 rounded-md font-semibold hover:opacity-80 transition-opacity">
              View All
            </button>
          </Link>
        </div>
        
        {/* === YAHAN BADLAV KIYA GAYA HAI === */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {itemsToDisplay.map(event => (
            <motion.div key={event._id} variants={cardVariants}>
              <EventCard event={event} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
export default FeaturedEvents;