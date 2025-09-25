import Link from 'next/link';
import ResourceCard from './ResourceCard';

const FeaturedResources = ({ resources }) => {
  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Featured Resources</h2>
          <Link href="/resources">
            <button className="bg-orange-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-orange-600 transition-colors">
              View All
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resources.map(resource => (
            <ResourceCard key={resource._id} resource={resource} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedResources;
