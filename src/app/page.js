import HeroSection from '@/components/HeroSection';
import WhatWeDoSection from '@/components/WhatWeDoSection';
import WhyJoinUs from '@/components/WhyJoinUs';
import FeaturedProjects from '@/components/FeaturedProjects';
import TechSection from '@/components/TechSection';
import { client } from '../../sanity/lib/client'; // Sanity client import karein

// Sirf 2 latest projects fetch karne ke liye query
const projectsQuery = `*[_type == "project"] | order(_createdAt desc) [0...2] {
  _id,
  title,
  "slug": slug.current,
  description,
  "imageUrl": image.asset->url,
  tags
}`;

const technologiesQuery = `*[_type == "technology"]{
  _id,
  name,
  "logoUrl": logo.asset->url
}`;

export default async function Home() {
  // Sanity se projects ka data fetch karein
  const projects = await client.fetch(projectsQuery);
  const technologies = await client.fetch(technologiesQuery);

  return (
    <main>
      <HeroSection />
      <WhatWeDoSection />
      {/* Fetched projects ko component mein pass karein */}
      <FeaturedProjects projects={projects} />
      <TechSection technologies={technologies} />
      <WhyJoinUs />
    </main>
  );
}