'use client';

import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { urlFor } from '../../sanity/lib/client';

const components = {
  block: {
    h1: ({ children }) => <h1 className="text-4xl font-bold my-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-bold my-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-bold my-4">{children}</h3>,
    normal: ({ children }) => <p className="mb-4">{children}</p>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-4 my-4">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside my-4">{children}</ul>,
  },
  listItem: {
    bullet: ({ children }) => <li className="mb-2">{children}</li>,
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="my-8 relative w-full h-96">
          <Image
            className="object-contain"
            alt={value.alt || ''}
            src={urlFor(value).url()}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      );
    },
  },
};

const PortableTextComponent = ({ value }) => {
  return <PortableText value={value} components={components} />;
};

export default PortableTextComponent;