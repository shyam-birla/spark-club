'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const FeaturedResources = ({ resources = [], isRoadmap = false }) => {
  const [itemsToDisplay, setItemsToDisplay] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let limit = resources.length; // Default to all items from prop

      if (width < 768) { // Mobile
        limit = 2;
      } else if (width >= 768 && width < 1024) { // Laptop (md breakpoint)
        limit = 3;
      } else { // Large Desktop (lg breakpoint and above)
        limit = 3;
      }
      setItemsToDisplay(resources.slice(0, limit));
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resources]); // Depend on 'resources' prop

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <section className="bg-white/80 backdrop-blur-sm py-20 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-black">{isRoadmap ? 'Skill Section' : 'Featured Resources'}</h2>
        <p className="text-gray-600 mt-2 mb-12">{isRoadmap ? 'Start your learning journey with our curated paths.' : 'Check out these useful resources.'}</p>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-8 text-left"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {itemsToDisplay.map((item) => (
            <motion.div key={item._id || item._key} variants={cardVariants}>
              <Link href={isRoadmap ? `/resources/${item.slug}` : item.url} target={isRoadmap ? '_self' : '_blank'} rel="noopener noreferrer" className="block h-full">
                {/* --- CARD FIX: Corners, shadow, aur hover effects add kiye gaye hain --- */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden h-full transform transition-all duration-300 hover:shadow-xl hover:scale-[1.03]">
                  <div className="relative w-full h-32 md:h-48">
                    {(isRoadmap ? item.coverImageUrl : item.icon) ? (
                      <Image
                        src={isRoadmap ? item.coverImageUrl : item.icon}
                        alt={item.title || 'Image'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200"></div>
                    )}
                  </div>
                  <div className="p-3 md:p-6">
                    <h3 className="text-sm md:text-xl font-semibold text-black">{item.title}</h3>
                    <p className="text-xs md:text-sm text-gray-600 line-clamp-3 mt-1 md:mt-2">{item.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8 md:mt-16">
          <Link href="/resources">
            {/* --- BUTTON FIX: Text ko white kiya gaya hai aur baaki styling add ki hai --- */}
            <button className="bg-black text-white px-4 py-2 rounded-md font-semibold text-sm hover:opacity-80 transition-opacity md:px-8 md:py-3 md:text-lg">
              View All →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedResources;