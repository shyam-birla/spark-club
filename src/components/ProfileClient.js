// src/components/ProfileClient.js (FINAL - Complete and Ready to Paste)
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
// Sabhi zaroori icons import kiye gaye hain
import { FaLinkedin, FaGithub, FaGlobe, FaBriefcase, FaGraduationCap, FaCertificate, FaLightbulb, FaProjectDiagram } from 'react-icons/fa';

// Reusable Section Component
const Section = ({ title, icon, children }) => (
    <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8"
    >
        <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
            {icon}
            {title}
        </h2>
        {children}
    </motion.section>
);

// Date Formatter (Robust version)
const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    
    // YYYY-MM format ke liye
    if (/^\d{4}-\d{2}$/.test(dateString)) {
        const [year, month] = dateString.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }
    
    // Standard date string ke liye
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }

    // Agar koi bhi format match na ho
    return dateString;
};

export default function ProfileClient({ session, profileData }) {

    // New user state
    if (!profileData) {
        return (
            <main className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-semibold">Welcome, {session.user.name}!</h2>
                <p className="text-gray-600 mt-2">Let&#39;s set up your SPARK profile.</p>
                <Link href="/profile/edit">
                    <button className="mt-6 bg-black text-white px-6 py-2 rounded-md font-semibold hover:opacity-80">
                        Create Your Profile
                    </button>
                </Link>
            </main>
        );
    }

    const trulyCompleted = profileData.completedRoadmaps?.filter(p => p.completedCount === p.roadmap.totalResources) || [];

    return (
        <main className="container mx-auto px-4 py-12 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- Left Sidebar --- */}
                <aside className="lg:col-span-1 space-y-6 lg:sticky top-24 self-start">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                        <Image 
                            src={session.user.image} 
                            alt={session.user.name}
                            width={120} 
                            height={120} 
                            className="rounded-full mx-auto border-4 border-white shadow-lg"
                        />
                        <h1 className="text-2xl font-bold text-black mt-4">{profileData.userName || session.user.name}</h1>
                        <p className="text-md text-gray-500">{profileData.tagline}</p>
                        <Link href="/profile/edit">
                            <button className="mt-4 w-full bg-gray-100 text-black px-4 py-2 rounded-md font-semibold text-sm hover:bg-gray-200">
                                Edit Profile
                            </button>
                        </Link>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-lg mb-4">Additional Info</h3>
                        <p className="text-gray-600 text-sm mb-4 whitespace-pre-wrap">{profileData.bio}</p>
                        <div className="flex justify-center space-x-4">
                            {profileData.githubUrl && <a href={profileData.githubUrl} target="_blank" rel="noopener noreferrer"><FaGithub className="text-2xl text-gray-500 hover:text-black" /></a>}
                            {profileData.linkedinUrl && <a href={profileData.linkedinUrl} target="_blank" rel="noopener noreferrer"><FaLinkedin className="text-2xl text-gray-500 hover:text-black" /></a>}
                            {profileData.portfolioUrl && <a href={profileData.portfolioUrl} target="_blank" rel="noopener noreferrer"><FaGlobe className="text-2xl text-gray-500 hover:text-black" /></a>}
                        </div>
                    </div>
                </aside>

                {/* --- Right Main Content --- */}
                <div className="lg:col-span-2">

                    {/* Work Experience Section */}
                    {profileData.workExperience?.length > 0 && (
                        <Section title="Work Experience" icon={<FaBriefcase />}>
                            <div className="space-y-6">
                                {profileData.workExperience.map((exp, index) => (
                                    <div key={exp._key || index}>
                                        <h4 className="font-bold">{exp.title}</h4>
                                        <p className="font-semibold text-gray-700">{exp.company}</p>
                                        <p className="text-sm text-gray-500">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
                                        {exp.description && <p className="mt-2 text-gray-600 whitespace-pre-wrap">{exp.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Education Section */}
                    {profileData.education?.length > 0 && (
                        <Section title="Education" icon={<FaGraduationCap />}>
                             <div className="space-y-6">
                                {profileData.education.map((edu, index) => (
                                    <div key={edu._key || index}>
                                        <h4 className="font-bold">{edu.school}</h4>
                                        <p className="text-gray-700">{edu.degree}</p>
                                        <p className="text-sm text-gray-500">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Personal Projects Section (with Technologies) */}
                    {profileData.externalProjects?.length > 0 && (
                        <Section title="Personal Projects" icon={<FaProjectDiagram />}>
                            <div className="space-y-6">
                                {profileData.externalProjects.map((project, index) => (
                                    <div key={project._key || index}>
                                        <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-orange-600 hover:underline">
                                            {project.title}
                                        </a>
                                        <p className="mt-1 text-gray-600 whitespace-pre-wrap">{project.description}</p>
                                        
                                        {project.technologies && project.technologies.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {project.technologies.map(tech => (
                                                    tech && ( // Check if tech object exists
                                                        <span key={tech._id} className="bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-xs font-semibold">
                                                            {tech.name} {/* Using tech.name as corrected */}
                                                        </span>
                                                    )
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}
                    
                    {/* Completed Roadmaps Section */}
                    {trulyCompleted.length > 0 && (
                        <Section title="Completed Roadmaps" icon={<FaCertificate />}>
                            <div className="space-y-4">
                                {trulyCompleted.map(progress => (
                                    <div key={progress.roadmap._id}>
                                        <Link href={`/certificates/${progress.roadmap.slug}`} className="font-bold hover:underline text-orange-600">{progress.roadmap.title}</Link>
                                        <p className="text-xs text-gray-500">Completed on: {formatDate(progress.lastUpdated)}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* SPARK Projects Section */}
                    {profileData.projects?.length > 0 && (
                         <Section title="SPARK Projects" icon={<FaLightbulb />}>
                             <div className="space-y-4">
                                {profileData.projects.map(p => (
                                    <div key={p._id}>
                                        <Link href={`/projects/${p.slug.current}`} className="font-bold hover:underline">{p.title}</Link>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}
                </div>
            </div>
        </main>
    );
}



