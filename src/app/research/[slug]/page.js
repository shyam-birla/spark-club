import { client, urlFor } from '../../../../sanity/lib/client';
import Link from 'next/link';
import Image from 'next/image';
import PortableTextComponent from '@/components/PortableTextComponent';
import { FaDownload, FaExternalLinkAlt, FaGithub, FaUserFriends } from 'react-icons/fa';

// This function tells Next.js which pages to pre-build
export async function generateStaticParams() {
  const slugs = await client.fetch(`*[_type == "researchProject" && defined(slug.current)]{ "slug": slug.current }`);
  return slugs.map(s => ({ slug: s.slug }));
}

// This function generates dynamic SEO metadata for each page
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const query = `*[_type == "researchProject" && slug.current == $slug][0]{ title, "description": pt::text(description) }`;
  const project = await client.fetch(query, { slug });
  if (!project) return { title: "Research Not Found" };
  return {
    title: `${project.title} | SPARK Research`,
    description: project.description?.substring(0, 160) || `Learn about the ${project.title} research project by the SPARK Community.`,
  };
}

// This query fetches all the data for one specific research project
const researchProjectQuery = `*[_type == "researchProject" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  status,
  researchArea,
  description,
  "posterImageUrl": posterImage.asset->url,
  "researchPaperUrl": researchPaper.asset->url,
  "presentationSlidesUrl": presentationSlides.asset->url,
  interactiveDemoUrl,
  githubUrl,
  publicationLink,
  authors[]->{
    _id,
    name,
    role,
    "imageUrl": image.asset->url
  },
  mentors[]->{
    _id,
    name,
    role,
    "imageUrl": image.asset->url
  }
}`;

const ResourceLink = ({ href, icon, text }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-black">
      {icon}
      <span>{text}</span>
      <FaExternalLinkAlt className="ml-auto text-gray-500" />
    </a>
);

export default async function ResearchDetailPage({ params }) {
  const { slug } = await params;
  const project = await client.fetch(researchProjectQuery, { slug });

  if (!project) {
    return <div className="text-center py-20">Research project not found.</div>;
  }

  return (
    <main className="bg-gray-50/50 backdrop-blur-sm py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* --- Left Column --- */}
          <aside className="lg:col-span-1 space-y-6 lg:sticky top-24 self-start">
            {project.authors && project.authors.length > 0 && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-lg mb-4 text-black flex items-center gap-2"><FaUserFriends /> Authors</h3>
                <div className="space-y-4">
                  {project.authors.map(author => (
                    <div key={author._id} className="flex items-center gap-4">
                      {author.imageUrl && <Image src={author.imageUrl} alt={author.name} width={50} height={50} className="rounded-full object-cover" />}
                      <div>
                        <h4 className="font-bold text-black">{author.name}</h4>
                        <p className="text-sm text-gray-600">{author.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {project.mentors && project.mentors.length > 0 && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-lg mb-4 text-black">Mentors</h3>
                <div className="space-y-4">
                  {project.mentors.map(mentor => (
                    <div key={mentor._id} className="flex items-center gap-4">
                      {mentor.imageUrl && <Image src={mentor.imageUrl} alt={mentor.name} width={50} height={50} className="rounded-full object-cover" />}
                      <div>
                        <h4 className="font-bold text-black">{mentor.name}</h4>
                        <p className="text-sm text-gray-600">{mentor.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* --- Right Column --- */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <span className="inline-block bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                {project.researchArea?.replace('-', ' ').toUpperCase()}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-black">{project.title}</h1>
              {project.status && (
                <p className={`mt-4 font-semibold ${project.status === 'published' ? 'text-green-600' : 'text-blue-600'}`}>
                    Status: {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </p>
              )}
            </section>

            {project.description && (
              <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-bold text-black mb-6">Abstract</h2>
                <div className="prose max-w-none text-lg leading-relaxed">
                  <PortableTextComponent value={project.description} />
                </div>
              </section>
            )}

            <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-black mb-6">Project Resources</h2>
              <div className="flex flex-col gap-4">
                {project.publicationLink && <ResourceLink href={project.publicationLink} icon={<FaExternalLinkAlt />} text="View Publication" />}
                {project.githubUrl && <ResourceLink href={project.githubUrl} icon={<FaGithub />} text="View Source Code on GitHub" />}
                {project.interactiveDemoUrl && <ResourceLink href={project.interactiveDemoUrl} icon={<FaExternalLinkAlt />} text="View Interactive Demo" />}
                {project.researchPaperUrl && <ResourceLink href={project.researchPaperUrl} icon={<FaDownload />} text="Download Research Paper" />}
                {project.presentationSlidesUrl && <ResourceLink href={project.presentationSlidesUrl} icon={<FaDownload />} text="Download Presentation Slides" />}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
