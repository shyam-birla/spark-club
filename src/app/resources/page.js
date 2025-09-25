import { client } from '../../../sanity/lib/client';
import Link from 'next/link';
import { FaVideo, FaFileAlt, FaGraduationCap, FaTools, FaLink } from 'react-icons/fa';

const streamsQuery = `*[_type == "stream"]{
  _id,
  title,
  description,
  "slug": slug.current,
  modules[]{
    _key,
    title,
    description,
    resources[]{
      _key,
      title,
      link,
      type
    }
  }
}`;

// ResourceLink component ko light theme ke liye update kiya
const ResourceLink = ({ resource }) => {
  const getIcon = (type) => {
    if (type === 'video') return <FaVideo />;
    if (type === 'article') return <FaFileAlt />;
    if (type === 'course') return <FaGraduationCap />;
    if (type === 'tool') return <FaTools />;
    return <FaLink />;
  };

  return (
    <Link href={resource.link} target="_blank" rel="noopener noreferrer">
      <div className="bg-gray-200 p-3 rounded-md hover:bg-gray-300 transition-colors flex items-center gap-3">
        <span className="text-xl text-gray-700">{getIcon(resource.type)}</span>
        <span className="text-black font-medium truncate">{resource.title}</span>
      </div>
    </Link>
  );
};

export default async function ResourcesPage() {
  const streams = await client.fetch(streamsQuery);

  return (
    <main className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-2 text-black">Learning Roadmaps</h1>
      <p className="text-gray-600 mb-12">Your step-by-step guide to mastering new skills.</p>

      <div className="space-y-16">
        {streams.map((stream) => (
          // Stream ka main box ko light theme ke liye update kiya
          <div key={stream._id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-3xl font-bold text-black mb-2">{stream.title}</h2>
            <p className="text-gray-600 mb-8">{stream.description}</p>
            
            {/* Modules ki list */}
            <div className="space-y-6">
              {stream.modules?.map((module, index) => (
                // Module box ko light theme ke liye update kiya
                <div key={module._key} className="border-l-4 border-black pl-6 py-4 bg-white rounded-r-lg">
                  <h3 className="text-2xl font-semibold text-black">
                    {/* Module number ko dark grey kiya */}
                    <span className="text-gray-500">{index + 1}.</span> {module.title}
                  </h3>
                  <p className="text-gray-600 mt-1 mb-4">{module.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {module.resources?.map(res => <ResourceLink key={res._key} resource={res} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}