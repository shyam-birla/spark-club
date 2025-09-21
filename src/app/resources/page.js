import { client } from '../../../sanity/lib/client';
import Link from 'next/link';

// Sabhi streams aur unke andar ke modules/resources ko fetch karne ke liye query
const streamsQuery = `*[_type == "stream"]{
  _id,
  title,
  description,
  "slug": slug.current,
  modules[]{ // modules array ke saare items
    _key,
    title,
    description,
    resources[]{ // har module ke andar ke resources
      _key,
      title,
      link,
      type
    }
  }
}`;

// Chhota component jo har resource link ko uske type ke icon ke saath dikhayega
const ResourceLink = ({ resource }) => {
  const getIcon = (type) => {
    if (type === 'video') return '▶️';
    if (type === 'article') return '📄';
    if (type === 'course') return '🎓';
    if (type === 'tool') return '🛠️';
    return '🔗';
  };

  return (
    <Link href={resource.link} target="_blank" rel="noopener noreferrer">
      <div className="bg-gray-700 p-3 rounded-md hover:bg-gray-600 transition-colors flex items-center gap-3">
        <span className="text-xl">{getIcon(resource.type)}</span>
        <span className="text-white font-medium truncate">{resource.title}</span>
      </div>
    </Link>
  );
};

export default async function ResourcesPage() {
  const streams = await client.fetch(streamsQuery);

  return (
    <main className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-2">Learning Roadmaps</h1>
      <p className="text-gray-400 mb-12">Your step-by-step guide to mastering new skills.</p>

      <div className="space-y-16">
        {streams.map((stream) => (
          // Stream ka main box
          <div key={stream._id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-3xl font-bold text-orange-400 mb-2">{stream.title}</h2>
            <p className="text-gray-300 mb-8">{stream.description}</p>
            
            {/* Modules ki list */}
            <div className="space-y-6">
              {stream.modules?.map((module, index) => (
                <div key={module._key} className="border-l-4 border-orange-500 pl-6 py-4 bg-gray-900/50 rounded-r-lg">
                  <h3 className="text-2xl font-semibold text-white">
                    <span className="text-orange-500">{index + 1}.</span> {module.title}
                  </h3>
                  <p className="text-gray-400 mt-1 mb-4">{module.description}</p>
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