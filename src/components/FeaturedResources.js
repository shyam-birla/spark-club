'use client'; // Animation ke liye add kiya
import Link from 'next/link';
import ResourceCard from './ResourceCard';
import { motion } from 'framer-motion'; // Animation ke liye import kiya

const FeaturedResources = ({ resources }) => {
  if (!resources || resources.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-20 bg-gray-50/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-black">Featured Resources</h2>
          <Link href="/resources">
            <button className="bg-black text-white px-6 py-2 rounded-md font-semibold hover:opacity-80 transition-opacity">
              View All
            </button>
          </Link>
        </div>
        
        {/* === YAHAN LAYOUT AUR ANIMATION, DONO ADD KIYE GAYE HAIN === */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {resources.map(resource => (
            <motion.div key={resource._id} variants={cardVariants}>
              <ResourceCard resource={resource} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
export default FeaturedResources;