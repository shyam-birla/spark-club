// src/app/resources/[slug]/page.js (FINAL FIX)

import { client } from '../../../../sanity/lib/client';
import Link from 'next/link';
import Image from 'next/image';
import { FaCheckCircle, FaVideo, FaFileAlt, FaLink, FaGraduationCap } from 'react-icons/fa';

// --- CHANGE 1: Function ki definition mein (slug) ki jagah ({ slug }) kiya ---
async function getRoadmapData({ slug }) {
  const query = `*[_type == "stream" && slug.current == $slug][0]{
    _id,
    title,
    subtitle,
    "slug": slug.current,
    "coverImageUrl": coverImage.asset->url,
    whatYouWillLearn,
    skills[]->{
      _id,
      name,
      "logoUrl": logo.asset->url
    },
    modules[]{
      _key,
      title,
      description,
      subTopics[]{
        _key,
        title,
        resources[]{
          _key,
          title,
          duration,
          type,
          videoUrl,
          link,
          "fileURL": fileUpload.asset->url
        }
      }
    }
  }`;

  const roadmap = await client.fetch(query, { slug });
  return roadmap;
}

const ResourceIcon = ({ type }) => {
    switch (type) {
        case 'videoEmbed': return <FaVideo className="text-gray-500" />;
        case 'file': return <FaFileAlt className="text-gray-500" />;
        case 'externalCourse': return <FaGraduationCap className="text-gray-500" />;
        default: return <FaLink className="text-gray-500" />;
    }
};


export default async function RoadmapDetailPage({ params }) {
  // --- CHANGE 2: Yahan hum ab poora 'params' object pass kar rahe hain ---
  const roadmap = await getRoadmapData(params);

  if (!roadmap) {
    return (
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold">Roadmap Not Found</h1>
        </main>
      );
  }

  // --- Smart Stats Calculation ---
  let totalDuration = 0;
  roadmap.modules?.forEach(module => {
    module.subTopics?.forEach(subTopic => {
        subTopic.resources?.forEach(resource => {
            if(resource.duration) totalDuration += resource.duration;
        });
    });
  });
  const totalHours = Math.round(totalDuration / 60);

  return (
    <main className="bg-gray-50">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          <div className="lg:col-span-2">
            <h1 className="text-4xl md:text-5xl font-bold text-black">{roadmap.title}</h1>
            <p className="text-lg text-gray-600 mt-4">{roadmap.subtitle}</p>

            <div className="text-sm text-gray-700 mt-6 flex items-center gap-4">
                <span>Est. {totalHours} hours to complete</span>
                <span className="text-gray-300">|</span>
                <span>{roadmap.modules?.length || 0} Modules</span>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 mt-10">
                <h2 className="text-2xl font-bold mb-4">What You Will Learn</h2>
                <ul className="space-y-3">
                    {roadmap.whatYouWillLearn?.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4">Skills You Will Gain</h2>
                <div className="flex flex-wrap gap-3">
                    {roadmap.skills?.map((skill) => (
                        <span key={skill._id} className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded-full font-medium flex items-center gap-2 text-sm">
                            {skill.logoUrl && (
                                <Image 
                                    src={skill.logoUrl} 
                                    alt={`${skill.name} logo`} 
                                    width={16} 
                                    height={16} 
                                    className="object-contain"
                                />
                            )}
                            {skill.name}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-6">Syllabus</h2>
                <div className="space-y-4">
                    {roadmap.modules?.map((module, index) => (
                        <details key={module._key} className="bg-white rounded-lg border border-gray-200 group" open={index === 0}>
                            <summary className="p-5 font-bold text-lg cursor-pointer flex justify-between items-center group-hover:bg-gray-50">
                                <span>Module {index + 1}: {module.title}</span>
                                <span className="transform transition-transform duration-200 group-open:rotate-180">▼</span>
                            </summary>
                            <div className="p-5 border-t border-gray-200">
                                <p className="text-gray-600 mb-6">{module.description}</p>
                                {module.subTopics?.map((subTopic) => (
                                    <div key={subTopic._key} className="mb-4">
                                        <h4 className="font-semibold text-gray-800 mb-2">{subTopic.title}</h4>
                                        <ul className="space-y-2 pl-4">
                                            {subTopic.resources?.map((resource) => (
                                                <li key={resource._key} className="flex items-center gap-3 text-sm">
                                                    <ResourceIcon type={resource.type} />
                                                    <span className="flex-grow">{resource.title}</span>
                                                    {resource.duration && <span className="text-gray-500">{resource.duration} min</span>}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {roadmap.coverImageUrl && (
                        <div className="relative w-full h-48">
                            <Image src={roadmap.coverImageUrl} alt={roadmap.title} fill className="object-cover" />
                        </div>
                    )}
                    <div className="p-6">
                        <Link href={`/learn/${roadmap.slug}`}>
                            <button className="w-full bg-black text-white px-8 py-3 rounded-md font-semibold text-lg hover:opacity-80 transition-opacity">
                                Start Learning
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}