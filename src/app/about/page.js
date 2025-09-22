import { client } from '../../../sanity/lib/client';
import PortableTextComponent from '@/components/PortableTextComponent';
import Image from 'next/image';

// Query to fetch the single 'aboutPage' document
const aboutPageQuery = `*[_type == "aboutPage"][0]{
  _id,
  title,
  "imageUrl": mainImage.asset->url,
  content
}`;

export default async function AboutPage() {
  const about = await client.fetch(aboutPageQuery);

  if (!about) {
    return <div>About page content not found.</div>;
  }

  return (
    <main className="bg-black container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-white mb-8">{about.title}</h1>
      </div>

      {about.imageUrl && (
        <div className="relative w-full max-w-5xl h-96 mx-auto mb-12">
          <Image 
            src={about.imageUrl} 
            alt={about.title} 
            layout="fill"
            objectFit="cover"
            className="rounded-lg shadow-lg" 
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto prose prose-invert lg:prose-xl text-gray-300 leading-relaxed">
        {about.content && (
          <PortableTextComponent value={about.content} />
        )}
      </div>
    </main>
  );
}