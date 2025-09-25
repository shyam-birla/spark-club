import Image from 'next/image';
import Link from 'next/link';

const FeaturedProjects = ({ projects = [] }) => {
  return (
    <section className="bg-black py-20 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-white">From Our Lab</h2>
        <p className="text-gray-300 mt-2 mb-12">Here&apos;s a glimpse of what we&apos;ve been working on.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {projects.map((project) => (
            <Link href={`/projects/${project.slug}`} key={project.slug}>
              <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-orange-500/20 hover:scale-105 transform cursor-pointer">
                <div className="relative w-full h-56 bg-gray-800 flex items-center justify-center">
                  <Image 
                    src={project.imageUrl || '/placeholder.png'} 
                    alt={project.title} 
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags && project.tags.map(tag => (
                      <span key={tag} className="bg-gray-700 text-gray-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-16">
          <Link href="/projects">
            <button className="bg-orange-500 text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-orange-600 transform hover:scale-105">
              View All Projects →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
