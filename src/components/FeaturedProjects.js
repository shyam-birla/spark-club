'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const FeaturedProjects = ({ projects = [] }) => {
  const containerVariants = { /* ...variants... */ };
  const cardVariants = { /* ...variants... */ };

  return (
    <section className="bg-white/50 backdrop-blur-sm py-20 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-black">From Our Lab</h2>
        <p className="text-gray-600 mt-2 mb-12">Here&apos;s a glimpse of what we&apos;ve been working on.</p>
        
        {/* === YAHAN BADLAV KIYA GAYA HAI === */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {projects.map((project) => (
            <motion.div key={project.slug} variants={cardVariants}>
              <Link href={`/projects/${project.slug}`}>
                <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:scale-[1.03] transform cursor-pointer h-full">
                  {/* ...card content... */}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16">
          <Link href="/projects">
            <button className="bg-black text-white px-8 py-3 rounded-md font-semibold text-lg hover:opacity-80 transition-opacity">
              View All Projects →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};
export default FeaturedProjects;