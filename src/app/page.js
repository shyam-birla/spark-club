import HeroSection from '@/components/HeroSection';
import WhatWeDoSection from '@/components/WhatWeDoSection';
import FeaturedProjects from '@/components/FeaturedProjects';
import TechSection from '@/components/TechSection';
import { client } from '../../sanity/lib/client';
import FeaturedEvents from '@/components/FeaturedEvents';
import FeaturedResources from '@/components/FeaturedResources';
import FeaturedBlogPosts from '@/components/FeaturedBlogPosts';

// --- Data Queries for Homepage Sections ---

const projectsQuery = `*[_type == "project"] | order(_createdAt desc) [0...2] {
  _id, title, "slug": slug.current, description, "imageUrl": image.asset->url, tags
}`;

const technologiesQuery = `*[_type == "technology"]{
  _id, name, "logoUrl": logo.asset->url
}`;

const eventsQuery = `*[_type == "event" && status == "upcoming"] | order(eventDate asc) [0...2] {
  _id, title, "slug": slug.current, eventDate, venue, "imageUrl": coverImage.asset->url
}`;

const resourcesQuery = `*[_type == "resource"] | order(_createdAt desc) [0...3] {
  _id, title, description, url, "icon": icon.asset->url
}`;

const postsQuery = `*[_type == "blogPost"] | order(publishedAt desc) [0...3] {
  _id, title, "slug": slug.current, "imageUrl": mainImage.asset->url, publishedAt
}`;


export default async function Home() {
  let projects = [];
  let technologies = [];
  let events = [];
  let resources = [];
  let posts = [];

  try {
    // Fetch all data in parallel for better performance
    [projects, technologies, events, resources, posts] = await Promise.all([
      client.fetch(projectsQuery),
      client.fetch(technologiesQuery),
      client.fetch(eventsQuery),
      client.fetch(resourcesQuery),
      client.fetch(postsQuery),
    ]);
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
    // Components will receive empty arrays and should handle them gracefully.
  }

  return (
    <main>
      <HeroSection />
      <WhatWeDoSection />
      <FeaturedProjects projects={projects} />
      <FeaturedEvents events={events} />
      <TechSection technologies={technologies} />
      <FeaturedBlogPosts posts={posts} />
      <FeaturedResources resources={resources} />
    </main>
  );
}
