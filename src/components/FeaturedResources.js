'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const FeaturedResources = ({ resources = [], isRoadmap = false }) => {
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
    <section className="bg-white/50 backdrop-blur-sm py-20 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-black">{isRoadmap ? 'Skill Section' : 'Featured Resources'}</h2>
        <p className="text-gray-600 mt-2 mb-12">{isRoadmap ? 'Start your learning journey with our curated paths.' : 'Check out these useful resources.'}</p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {resources.map((item) => (
            <motion.div key={item._id || item._key} variants={cardVariants}>
              <Link href={isRoadmap ? `/resources/${item.slug}` : item.url} target={isRoadmap ? '_self' : '_blank'} rel="noopener noreferrer" className="block h-full">
                {/* --- CARD FIX: Corners, shadow, aur hover effects add kiye gaye hain --- */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden h-full transform transition-all duration-300 hover:shadow-xl hover:scale-[1.03]">
                  <div className="relative w-full h-48">
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
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-black">{item.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mt-2">{item.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16">
          <Link href="/resources">
            {/* --- BUTTON FIX: Text ko white kiya gaya hai aur baaki styling add ki hai --- */}
            <button className="bg-black text-white px-8 py-3 rounded-md font-semibold text-lg hover:opacity-80 transition-opacity">
              View All →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedResources;