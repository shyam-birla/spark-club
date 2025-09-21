import FeaturedProjects from '@/components/FeaturedProjects';

export default function ProjectsPage() {
  return (
    <main className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-8">Projects</h1>
      <p>Explore our ongoing and past projects.</p>
      <FeaturedProjects />
    </main>
  );
}
