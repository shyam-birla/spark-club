// src/app/page.js (Updated with new order and blog section removed)
import HeroSection from '@/components/HeroSection';
import WhatWeDoSection from '@/components/WhatWeDoSection';
import FeaturedProjects from '@/components/FeaturedProjects';
import TechSection from '@/components/TechSection';
import { client } from '../../sanity/lib/client';
import FeaturedEvents from '@/components/FeaturedEvents';
import FeaturedResources from '@/components/FeaturedResources';
// import FeaturedBlogPosts from '@/components/FeaturedBlogPosts'; // Blog section ko hata diya gaya hai
import AnimatedSection from '@/components/AnimatedSection';

// --- DATA QUERIES ---

const projectsQuery = `*[_type == "project" && isFeatured == true] | order(displayOrder asc) {
  _id, title, "slug": slug.current, description, "cardImageUrl": cardImage.asset->url, tags
}`;

const technologiesQuery = `*[_type == "technology" && showOnHomepage == true]{
  _id, name, "logoUrl": logo.asset->url
}`;

const eventsQuery = `*[_type == "event" && status == "upcoming"] | order(eventDate asc) [0...3] {
  _id, title, "slug": slug.current, eventDate, venue, "imageUrl": coverImage.asset->url
}`;

const roadmapsQuery = `*[_type == "stream" && isFeatured == true] | order(displayOrder asc) {
  _id, 
  title, 
  description, 
  "slug": slug.current,
  "coverImageUrl": coverImage.asset->url
}`;

// const postsQuery = `...`; // Blog query ko hata diya gaya hai


export default async function Home() {
  let projects = [], technologies = [], events = [], roadmaps = [];
  // `posts` ko yahan se hata diya gaya hai

  try {
    [projects, technologies, events, roadmaps] = await Promise.all([
      client.fetch(projectsQuery),
      client.fetch(technologiesQuery),
      client.fetch(eventsQuery),
      client.fetch(roadmapsQuery),
      // `client.fetch(postsQuery)` ko yahan se hata diya gaya hai
    ]);
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
  }

  return (
    <main>
      {/* --- Sections ko naye order mein lagaya gaya hai --- */}
      <HeroSection />
      <AnimatedSection><TechSection technologies={technologies} /></AnimatedSection>
      <AnimatedSection><WhatWeDoSection /></AnimatedSection>
      <AnimatedSection><FeaturedEvents events={events} /></AnimatedSection>
      <AnimatedSection><FeaturedResources resources={roadmaps} isRoadmap={true} /></AnimatedSection>
      <AnimatedSection><FeaturedProjects projects={projects} /></AnimatedSection>
      {/* <AnimatedSection><FeaturedBlogPosts posts={posts} /></AnimatedSection> */} {/* Blog section ko yahan se hata diya gaya hai */}
    </main>
  );
}