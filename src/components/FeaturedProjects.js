'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const FeaturedProjects = ({ projects = [] }) => {
  // Aapke animation variants yahan rahenge
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <section className="bg-white/50 backdrop-blur-sm py-20 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-black">From Our Lab</h2>
        <p className="text-gray-600 mt-2 mb-12">Here&apos;s a glimpse of what we&apos;ve been working on.</p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {projects.map((project) => {
            console.log("Project Card Image URL:", project.cardImageUrl);
            return (
              <motion.div key={project.slug} variants={cardVariants}>
                <Link href={`/projects/${project.slug}`}>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:scale-[1.03] transform cursor-pointer h-full flex flex-col">
                    <div className="relative w-full h-48">
                      {project.cardImageUrl && (
                        <Image
                          src={project.cardImageUrl}
                          alt={project.title || 'Project Image'}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="p-6 flex-grow">
                      <h3 className="text-xl font-semibold text-black">{project.title}</h3>
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {project.tags.map((tag) => (
                            <span key={tag} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
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
