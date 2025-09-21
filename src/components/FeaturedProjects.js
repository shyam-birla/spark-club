import Image from 'next/image';
import Link from 'next/link';

const FeaturedProjects = ({ projects = [] }) => {
  return (
    <section className="bg-white py-20 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-black">From Our Lab</h2>
        {/* // PROBLEM THEEK KAR DIYA GAYA HAI:
        // String ko single quotes (') ki jagah double quotes (") mein daala gaya hai */}
        <p className="text-gray-700 mt-2 mb-12">{"Here's a glimpse of what we've been working on."}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {projects.map((project) => (
            <Link href={`/projects/${project.slug}`} key={project.slug}>
              <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.title} className="object-cover w-full h-full" />
                  ) : (
                    <img src="https://via.placeholder.com/500x300" alt={project.title} className="object-cover w-full h-full" />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-700 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags && project.tags.map(tag => (
                      <span key={tag} className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-16">
          <Link href="/projects">
            <button className="bg-orange-500 text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-orange-600 transition-colors">
              View All Projects →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;