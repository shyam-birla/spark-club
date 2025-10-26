'use client';

import { useState, useEffect } from 'react';
import { client } from '../../../sanity/lib/client';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';
import { FaFlask, FaSearch, FaFilter, FaTag, FaExclamationCircle } from 'react-icons/fa';
import Breadcrumbs from '@/components/Breadcrumbs';
import CallToAction from '@/components/CallToAction';

// Query to fetch all research projects
const researchProjectsQuery = `*[_type == "researchProject" && approvalStatus == "published"] | order(status asc, _createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  researchArea,
  "summary": pt::text(description),
  "imageUrl": posterImage.asset->url
}`;

const ResearchCard = ({ project }) => (
  <Link href={`/research/${project.slug}`}>
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col group">
      {project.imageUrl && (
        <div className="relative w-full h-40 mb-4 rounded-md overflow-hidden">
            <Image src={project.imageUrl} alt={project.title} fill className="object-cover" />
        </div>
      )}
      <h3 className="text-xl font-bold text-black mb-2 group-hover:text-orange-600 transition-colors">{project.title}</h3>
      <p className="text-gray-600 text-sm line-clamp-3 flex-grow">{project.summary}</p>
      <span className="mt-4 inline-block bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full self-start flex items-center gap-1">
        <FaTag className="text-gray-500" />{project.researchArea.replace('-', ' ').toUpperCase()}
      </span>
    </div>
  </Link>
);

export default function ResearchPage() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const data = await client.fetch(researchProjectsQuery);
        setProjects(data);
        setFilteredProjects(data);
      } catch (error) {
        console.error("Failed to fetch research projects:", error);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedArea !== 'all') {
      filtered = filtered.filter(project => project.researchArea === selectedArea);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b._createdAt) - new Date(a._createdAt); // Assuming _createdAt exists
      } else if (sortOrder === 'oldest') {
        return new Date(a._createdAt) - new Date(b._createdAt);
      } else if (sortOrder === 'a-z') {
        return a.title.localeCompare(b.title);
      } else if (sortOrder === 'z-a') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

    setFilteredProjects(filtered);
  }, [searchTerm, selectedArea, sortOrder, projects]);

  const researchAreas = ['all', 'ai-ml', 'blockchain-web3', 'cybersecurity', 'iot', 'dsai', 'other'];

  return (
    <main className="bg-white/80 backdrop-blur-sm py-20">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[{ label: 'Home', href: '/', icon: 'FaHome' }, { label: 'Research', icon: 'FaFlask' }]} className="mb-4" />
        <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black flex items-center justify-center gap-3">
              <FaFlask className="text-purple-500" /> Research Wing
            </h1>
            <p className="text-gray-600 mb-12 max-w-3xl mx-auto">
                Exploring the frontiers of technology. Here you can find our community&apos;s ongoing and completed research projects.
            </p>
        </div>

        <CallToAction
          title="Have a Research Idea?"
          description="We are always looking for new and exciting research projects to work on. If you have an idea, we would love to hear it!"
          buttonText="Submit Your Research Project"
          buttonLink="/research/new"
        />

        {/* Filter and Search Controls */}
        <div className="mb-12 flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:flex-grow">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects by title..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 transition-shadow"
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-full md:w-1/4">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 transition-shadow"
              onChange={e => setSelectedArea(e.target.value)}
            >
              <option value="all">ALL AREAS</option>
              {researchAreas.slice(1).map(area => (
                <option key={area} value={area}>
                  {area.replace('-', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          {/* Sort Order Dropdown */}
          <div className="relative w-full md:w-1/4">
            <select
              className="w-full p-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 transition-shadow"
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
            >
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
              <option value="a-z">Sort by: A-Z</option>
              <option value="z-a">Sort by: Z-A</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
            <div className="text-center text-gray-500 py-16">Loading projects...</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.length > 0 ? (
                filteredProjects.map(project => (
                  <AnimatedSection key={project._id}>
                    <ResearchCard project={project} />
                  </AnimatedSection>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 bg-white/50 rounded-lg shadow-sm min-h-[300px] flex items-center justify-center gap-2">
                    <FaExclamationCircle className="text-red-500 text-xl" />
                    <p className="text-xl font-medium">No projects found for the selected criteria.</p>
                </div>
              )}
            </div>
        )}
      </div>
    </main>
  );
}