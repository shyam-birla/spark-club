import Image from 'next/image';
import Link from 'next/link';

const ResourceCard = ({ resource }) => {
  return (
    <Link href={resource.url} target="_blank" rel="noopener noreferrer">
      <div className="bg-white p-6 rounded-lg h-full border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
        {resource.icon && (
          <Image src={resource.icon} alt={`${resource.title} icon`} width={40} height={40} className="mb-4" />
        )}
        <h3 className="text-xl font-bold text-black mb-2">{resource.title}</h3>
        <p className="text-gray-600">{resource.description}</p>
      </div>
    </Link>
  );
};

// Yahan galti theek kar di gayi hai
export default ResourceCard;