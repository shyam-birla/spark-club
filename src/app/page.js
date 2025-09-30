import HeroSection from '@/components/HeroSection';
import WhatWeDoSection from '@/components/WhatWeDoSection';
import FeaturedProjects from '@/components/FeaturedProjects';
import TechSection from '@/components/TechSection';
import { client } from '../../sanity/lib/client';
import FeaturedEvents from '@/components/FeaturedEvents';
import FeaturedResources from '@/components/FeaturedResources';
import AnimatedSection from '@/components/AnimatedSection';
import Testimonials from '@/components/Testimonials';
import StatsSection from '@/components/StatsSection';
import Footer from '@/components/Footer'; // <-- 1. Footer ko yahan import kiya

// --- DATA QUERIES ---

const projectsQuery = `*[_type == "project" && isFeatured == true] | order(displayOrder asc) {
  _id, title, "slug": slug.current, description, "cardImageUrl": cardImage.asset->url, tags
}`;

const technologiesQuery = `*[_type == "technology" && showOnHomepage == true]{
  _id, name, "logoUrl": logo.asset->url
}`;

const eventsQuery = `*[_type == "event" && eventDate > now()] | order(eventDate asc) [0...3] {
  _id, title, "slug": slug.current, eventDate, "imageUrl": coverImage.asset->url, registrationStatus
}`;

const roadmapsQuery = `*[_type == "stream" && isFeatured == true] | order(displayOrder asc) [0...3] {
  _id, title, description, "slug": slug.current, "coverImageUrl": coverImage.asset->url
}`;

const testimonialsQuery = `*[_type == "testimonial" && isFeatured == true]{
  _id, quote, authorName, authorRole, "authorImageUrl": authorImage.asset->url
}`;

const statsQuery = `*[_type == "siteStats"][0]{
  membersCount, projectsCount, eventsCount
}`;

// 2. Footer ke liye social links ki query yahan add ki
const socialLinksQuery = `*[_type == "socialLink"]{
  _id,
  name,
  url,
  icon
}`;

export default async function Home() {
  let projects = [], technologies = [], events = [], roadmaps = [], testimonials = null, stats = null, socialLinks = [];

  try {
    // 3. socialLinks ko bhi ek saath fetch kiya
    [projects, technologies, events, roadmaps, testimonials, stats, socialLinks] = await Promise.all([
      client.fetch(projectsQuery),
      client.fetch(technologiesQuery),
      client.fetch(eventsQuery),
      client.fetch(roadmapsQuery),
      client.fetch(testimonialsQuery),
      client.fetch(statsQuery),
      client.fetch(socialLinksQuery),
    ]);
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
  }

  return (
    // 4. Fragment (<>...</>) add kiya taaki main aur footer dono return kar sakein
    <>
      <main>
        <HeroSection />
        <AnimatedSection><TechSection technologies={technologies} /></AnimatedSection>
        <AnimatedSection><WhatWeDoSection /></AnimatedSection>
        <AnimatedSection><StatsSection stats={stats} /></AnimatedSection>
        <AnimatedSection><FeaturedEvents events={events} /></AnimatedSection>
        <AnimatedSection><FeaturedResources resources={roadmaps} isRoadmap={true} /></AnimatedSection>
        <AnimatedSection><FeaturedProjects projects={projects} /></AnimatedSection>
        <AnimatedSection><Testimonials testimonials={testimonials} /></AnimatedSection>
      </main>
      {/* 5. Footer ko yahan render kiya */}
      <Footer socialLinks={socialLinks} />
    </>
  );
}