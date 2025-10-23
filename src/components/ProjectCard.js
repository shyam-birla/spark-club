import Link from 'next/link';
import Image from 'next/image';
import { FaTag } from 'react-icons/fa';

const ProjectCard = ({ project }) => {
  return (
    <Link href={`/projects/${project.slug}`}>
      <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:scale-[1.03] transform cursor-pointer h-full flex flex-col">
        <div className="relative w-full h-40 md:h-72">
          {project.cardImageUrl && (
            <Image
              src={project.cardImageUrl}
              alt={project.title || 'Project Image'}
              fill
              className="object-contain"
            />
          )}
        </div>
        <div className="p-1 flex-grow">
          <h3 className="text-sm md:text-lg font-semibold text-black">{project.title}</h3>
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2 md:gap-2 md:mt-4">
              {project.tags.map((tag) => (
                <span key={tag} className="bg-gray-200 text-gray-800 px-1 py-0.5 rounded-full text-xs md:text-sm flex items-center gap-1">
                  <FaTag className="text-gray-500" />{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
