'use client';

import { useState, useEffect, useMemo } from 'react';
import { FaCodeBranch, FaSearch } from 'react-icons/fa';
import ProjectCard from '@/components/ProjectCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import CallToAction from '@/components/CallToAction';
import CardSkeleton from '@/components/CardSkeleton'; // Import CardSkeleton

const ProjectListClient = ({ initialProjects }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest', 'a-z', 'z-a'
  const [filteredProjects, setFilteredProjects] = useState(initialProjects);
  const [loading, setLoading] = useState(false); // New loading state

  // Extract all unique tags from projects
  const allTags = useMemo(() => {
    const tags = new Set();
    initialProjects.forEach(project => {
      project.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [initialProjects]);

  useEffect(() => {
    setLoading(true); // Set loading to true when filters or sort order change
    const timer = setTimeout(() => {
      let projectsToFilter = [...initialProjects];

      // Filter by search query
      if (searchQuery) {
        projectsToFilter = projectsToFilter.filter(project =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filter by selected tags
      if (selectedTags.length > 0) {
        projectsToFilter = projectsToFilter.filter(project =>
          selectedTags.every(tag => project.tags?.includes(tag))
        );
      }

      // Sort projects
      projectsToFilter.sort((a, b) => {
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

      setFilteredProjects(projectsToFilter);
      setLoading(false); // Set loading to false after filtering and sorting
    }, 300); // Simulate a 300ms network delay

    return () => clearTimeout(timer);
  }, [initialProjects, searchQuery, selectedTags, sortOrder]);

  const handleTagClick = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSortOrder('newest'); // Reset sort order as well
  };

  const showClearFiltersButton = searchQuery || selectedTags.length > 0 || sortOrder !== 'newest';

  const renderProjectSection = (title, projectsList, placeholderMessage) => {
    const noProjectsMessage = (
      searchQuery || selectedTags.length > 0
        ? 'No projects match your current filters. Try adjusting your search or clearing filters.'
        : placeholderMessage
    );

    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-black mb-6 border-b-2 border-green-500 pb-2">{title}</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {[...Array(3)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : projectsList.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {projectsList.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8 bg-white rounded-lg shadow-sm">{noProjectsMessage}</p>
        )}
      </section>
    );
  };

  const upcomingProjects = filteredProjects.filter(project => project.status === 'upcoming');
  const inProgressProjects = filteredProjects.filter(project => project.status === 'in-progress');
  const completedProjects = filteredProjects.filter(project => project.status === 'completed');
  const archivedProjects = filteredProjects.filter(project => project.status === 'archived');


  return (
    <main className="bg-white/80 backdrop-blur-sm py-20">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[{ label: 'Home', href: '/', icon: 'FaHome' }, { label: 'Projects', icon: 'FaCodeBranch' }]} className="mb-4" />
        <h1 className="text-4xl font-bold mb-8 text-black text-center flex items-center justify-center gap-3"><FaCodeBranch className="text-green-500" /> Projects</h1>
        <p className="text-gray-600 mb-12 text-center">Explore our ongoing and past projects.</p>
        
        {/* Filter and Sort UI */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="w-full md:w-1/3">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
              <option value="a-z">Sort by: A-Z</option>
              <option value="z-a">Sort by: Z-A</option>
            </select>
          </div>
          {showClearFiltersButton && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-red-500 text-white rounded-md font-semibold text-sm hover:bg-red-600 transition-colors w-full md:w-auto"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="mb-12 flex flex-wrap gap-2 justify-center">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200
                  ${selectedTags.includes(tag)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
        
        <CallToAction
          title="Have a Project Idea?"
          description="We are always looking for new and exciting projects to work on. If you have an idea, we would love to hear it!"
          buttonText="Submit Your Project"
          buttonLink="/projects/new"
        />

        {renderProjectSection(
          'In Progress Projects',
          inProgressProjects,
          'No projects currently in progress. Check back later for updates!'
        )}

        {renderProjectSection(
          'Upcoming Projects',
          upcomingProjects,
          'No upcoming projects at the moment. Stay tuned for exciting new initiatives!'
        )}

        {renderProjectSection(
          'Completed Projects',
          completedProjects,
          'No completed projects yet. Be the first to finish one!'
        )}

        {renderProjectSection(
          'Archived Projects',
          archivedProjects,
          'No archived projects found.'
        )}
      </div>
    </main>
  );
};

export default ProjectListClient;
