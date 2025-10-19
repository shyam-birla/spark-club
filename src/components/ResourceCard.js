import Image from 'next/image';
import Link from 'next/link';

const ResourceCard = ({ resource }) => {
  // The resource object now needs to be queried to include the cardImageUrl
  // I am assuming the query will be updated to provide `cardImageUrl` and `slug`
  const resourceUrl = resource.slug ? `/resources/${resource.slug}` : resource.url;
  const linkTarget = resource.slug ? '_self' : '_blank';

  return (
    (<Link
      href={resourceUrl}
      target={linkTarget}
      rel={linkTarget === '_blank' ? 'noopener noreferrer' : undefined}>

      <div className="bg-white rounded-lg overflow-hidden transition-all duration-300 cursor-pointer h-full flex flex-col border-4 border-red-500 hover:shadow-xl hover:scale-105 transform">
        <div className="relative w-full h-72">
          {resource.cardImageUrl && (
            <Image
              src={resource.cardImageUrl}
              alt={resource.title}
              fill
              className="object-contain" />
          )}
        </div>
        <div className="p-2 flex-grow flex flex-col">
          <h3 className="text-lg font-bold text-black mt-2">{resource.title}</h3>
          <p className="text-gray-600 text-sm mt-1 flex-grow">{resource.description}</p>
        </div>
      </div>

    </Link>)
  );
};

export default ResourceCard;
