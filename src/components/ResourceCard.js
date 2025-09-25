import Image from 'next/image';
import Link from 'next/link';

const ResourceCard = ({ resource }) => {
  return (
    <Link href={resource.url} target="_blank">
      <div className="bg-gray-800 p-6 rounded-lg h-full border border-gray-700 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
        {resource.icon && (
          <Image src={resource.icon} alt={`${resource.title} icon`} width={40} height={40} className="mb-4" />
        )}
        <h3 className="text-xl font-bold text-white mb-2">{resource.title}</h3>
        <p className="text-gray-400">{resource.description}</p>
      </div>
    </Link>
  );
};

export default ResourceCard;
