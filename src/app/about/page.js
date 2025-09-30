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

// SEO ke liye metadata generate karein
export async function generateMetadata() {
  const query = `*[_type == "aboutPage"][0]{
    title,
    "description": pt::text(content)
  }`;
  const about = await client.fetch(query);

  if (!about) {
    return {
      title: "About Us | Spark Club",
      description: "Learn more about the mission, vision, and history of Spark Club.",
    };
  }

  return {
    title: `${about.title} | Spark Club`,
    description: about.description.substring(0, 160),
  };
}


export default async function AboutPage() {
  const about = await client.fetch(aboutPageQuery);

  if (!about) {
    return <div>About page content not found.</div>;
  }

  return (
    // === YAHAN BADLAV KIYA GAYA HAI ===
    <main className="bg-gray-50/50 backdrop-blur-sm py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-black mb-8">{about.title}</h1>
        </div>

        {about.imageUrl && (
          <div className="relative w-full max-w-5xl h-96 mx-auto mb-12">
            <Image 
              src={about.imageUrl} 
              alt={about.title} 
              fill
              className="object-cover rounded-lg shadow-lg" 
            />
          </div>
        )}

        <div className="max-w-3xl mx-auto prose lg:prose-xl leading-relaxed text-gray-800">
          {about.content && (
            <PortableTextComponent value={about.content} />
          )}
        </div>
      </div>
    </main>
  );
}