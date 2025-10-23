'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import CardSkeleton from './CardSkeleton'; // Import CardSkeleton

// 1. Naye props add kiye gaye hain: showTitle, showButton
const FeaturedProjects = ({ projects = [], showTitle = true, showButton = true }) => {
  const [itemsToDisplay, setItemsToDisplay] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let limit = projects.length; // Default to all items from prop

      if (width < 768) { // Mobile
        limit = 2;
      } else if (width >= 768 && width < 1024) { // Laptop (md breakpoint)
        limit = 3;
      } else { // Large Desktop (lg breakpoint and above)
        limit = 3;
      }
      setItemsToDisplay(projects.slice(0, limit));
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [projects]); // Depend on 'projects' prop

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
    // Background ko bhi consistent rakha gaya hai
    <section className="bg-grey/40 backdrop-blur-sm py-20 px-4">
      <div className="container mx-auto text-center">
        
        {/* 2. Title ko conditionally render kiya gaya hai */}
        {showTitle && (
          <>
            <h2 className="text-3xl font-bold text-black">From Our Lab</h2>
            <p className="text-gray-600 mt-2 mb-12">Here&apos;s a glimpse of what we&apos;ve been working on.</p>
          </>
        )}
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-8 text-left"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {itemsToDisplay.map((project) => (
            <motion.div key={project.slug} variants={cardVariants}>
              <Link href={`/projects/${project.slug}`}>
                <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:scale-[1.03] transform cursor-pointer h-full flex flex-col">
                  <div className="relative w-full h-40 md:h-72">
                    {project.cardImageUrl && (
                      <Image
                        src={project.cardImageUrl}
                        alt={project.title || 'Project Image'}
                        fill
                        className="object-contain"
                      />
                    )}
                  </div>
                  <div className="p-1 flex-grow">
                    <h3 className="text-sm md:text-lg font-semibold text-black">{project.title}</h3>
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2 md:gap-2 md:mt-4">
                        {project.tags.map((tag) => (
                          <span key={tag} className="bg-gray-200 text-gray-800 px-1 py-0.5 rounded-full text-xs md:text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* 3. Button ko conditionally render kiya gaya hai */}
        {showButton && (
            <div className="mt-16">
            <Link href="/projects">
            <button className="bg-black text-white px-4 py-2 rounded-md font-semibold text-sm hover:opacity-80 transition-opacity transform hover:scale-105 md:px-8 md:py-3 md:text-lg">
              View All Projects
            </button>
            </Link>
            </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjects;
