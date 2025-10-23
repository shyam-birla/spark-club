import Link from 'next/link';
import Image from 'next/image';
import { FaTag } from 'react-icons/fa';

const ProjectCard = ({ project }) => {
  return (
    <Link href={`/projects/${project.slug}`}>
      <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:scale-[1.03] transform cursor-pointer h-full flex flex-col">
        <div className="relative w-full h-32 md:h-72">
          {project.cardImageUrl && (
            <Image
              src={project.cardImageUrl}
              alt={project.title || 'Project Image'}
              fill
              className="object-contain"
            />
          )}
        </div>
        <div className="p-0.5 flex-grow">
          <h3 className="text-xs md:text-lg font-semibold text-black">{project.title}</h3>
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-0.5 mt-0.5 md:gap-2 md:mt-2">
              {project.tags.map((tag) => (
                <span key={tag} className="bg-gray-200 text-gray-800 px-0.5 py-0.5 rounded-full text-[0.65rem] flex items-center gap-0.5">
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
