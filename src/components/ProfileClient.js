'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaGlobe, FaBriefcase, FaGraduationCap, FaCertificate, FaLightbulb, FaProjectDiagram } from 'react-icons/fa';
import { urlFor } from '../../sanity/lib/client';

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

const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    if (/^\d{4}-\d{2}$/.test(dateString)) {
        const [year, month] = dateString.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }
    return dateString;
};

const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export default function ProfileClient({ session, profileData }) {
    const trulyCompleted = profileData?.completedRoadmaps?.filter(p => p.completedCount === p.roadmap.totalResources) || [];
    const userDisplayName = profileData?.userName || session?.user?.name || 'User';
    const initials = getInitials(userDisplayName);
    const profileImageUrl = profileData?.userImage ? urlFor(profileData.userImage).width(120).height(120).url() : null; // Set to null if no custom image

    return (
        <main className="bg-gray-50/50 backdrop-blur-sm py-12 md:py-20 min-h-screen">
            <div className="container mx-auto px-4">
                {!profileData ? (
                    <div className="text-center py-20 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-3xl font-bold text-black mb-4">Welcome, {session.user.name}!</h2>
                        <p className="text-lg text-gray-700 mb-6">Your profile is looking a bit empty. Let&apos;s fill it up to showcase your skills and connect with the SPARK community!</p>
                        <Link href="/profile/edit">
                            <button className="mt-6 bg-orange-600 text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-orange-700 transition-colors">
                                Complete Your Profile Now
                            </button>
                        </Link>
                        <p className="text-sm text-gray-500 mt-4">It only takes a few minutes!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* --- Left Sidebar --- */}
                        <aside className="lg:col-span-1 space-y-6 lg:sticky top-24 self-start">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                                {profileImageUrl ? (
                                    <Image 
                                        src={profileImageUrl} 
                                        alt={userDisplayName}
                                        width={120} 
                                        height={120} 
                                        className="rounded-full mx-auto border-4 border-white shadow-lg object-cover"
                                    />
                                ) : (
                                    <div className="rounded-full mx-auto border-4 border-white shadow-lg object-cover bg-gray-200 flex items-center justify-center text-black font-bold text-5xl h-32 w-32">
                                        {initials}
                                    </div>
                                )}
                                <h1 className="text-2xl font-bold text-black mt-4">{userDisplayName}</h1>
                                <p className="text-sm text-gray-600 mt-1">{profileData?.headline || ''}</p>
                                <div className="mt-4 flex justify-center gap-3">
                                    <Link href="/profile/edit">
                                        <button className="bg-orange-600 text-white px-4 py-2 rounded-md">Edit Profile</button>
                                    </Link>
                                    <Link href="/profile/dashboard">
                                        <button className="bg-gray-100 text-black px-4 py-2 rounded-md font-semibold text-sm hover:bg-gray-200">
                                            My Events
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            <Section title="About" icon={<FaLightbulb />}>
                                <p className="text-gray-700">{profileData?.about || 'No bio yet.'}</p>
                            </Section>
                        </aside>
                        {/* --- Right Content --- */}
                        <section className="lg:col-span-2">
                            <Section title="Work Experience" icon={<FaBriefcase />}>
                                {profileData.workExperience?.length > 0 ? (
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
                                ) : (
                                    <div className="text-center text-gray-500 py-4">
                                        <p className="mb-2">No work experience added yet.</p>
                                        <Link href="/profile/edit" className="text-orange-600 hover:underline">Add Work Experience</Link>
                                    </div>
                                )}
                            </Section>
                            <Section title="Education" icon={<FaGraduationCap />}>
                                {profileData.education?.length > 0 ? (
                                     <div className="space-y-6">
                                        {profileData.education.map((edu, index) => (
                                            <div key={edu._key || index}>
                                                <h4 className="font-bold">{edu.school}</h4>
                                                <p className="text-gray-700">{edu.degree}</p>
                                                <p className="text-sm text-gray-500">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-4">
                                        <p className="mb-2">No education details added yet.</p>
                                        <Link href="/profile/edit" className="text-orange-600 hover:underline">Add Education</Link>
                                    </div>
                                )}
                            </Section>
                            <Section title="Personal Projects" icon={<FaProjectDiagram />}>
                                {profileData.externalProjects?.length > 0 ? (
                                    <div className="space-y-6">
                                        {profileData.externalProjects.map((project, index) => (
                                            <div key={project._key || index}>
                                                <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-orange-600 hover:underline">{project.title}</a>
                                                <p className="mt-1 text-gray-600 whitespace-pre-wrap">{project.description}</p>
                                                {project.technologies && project.technologies.length > 0 && (
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {project.technologies.map(tech => (
                                                            tech && (
                                                                <span key={tech._id} className="bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-xs font-semibold">{tech.name}</span>
                                                            )
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-4">
                                        <p className="mb-2">No personal projects added yet.</p>
                                        <Link href="/profile/edit" className="text-orange-600 hover:underline">Add Personal Project</Link>
                                    </div>
                                )}
                            </Section>
                            <Section title="Completed Roadmaps" icon={<FaCertificate />}>
                                {trulyCompleted.length > 0 ? (
                                    <div className="space-y-4">
                                        {trulyCompleted.map(progress => (
                                            <div key={progress.roadmap._id}>
                                                <Link href={`/certificates/${progress.roadmap.slug}`} className="font-bold hover:underline text-orange-600">{progress.roadmap.title}</Link>
                                                <p className="text-xs text-gray-500">Completed on: {formatDate(progress.lastUpdated)}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-4">
                                        <p className="mb-2">No completed roadmaps yet.</p>
                                        <Link href="/learn" className="text-orange-600 hover:underline">Explore Roadmaps</Link>
                                    </div>
                                )}
                            </Section>
                            <Section title="Projects" icon={<FaLightbulb />}>
                                {profileData.projects?.length > 0 ? (
                                     <div className="space-y-4">
                                        {profileData.projects.map(p => (
                                            <div key={p._id}>
                                                <Link href={`/projects/${p.slug.current}`} className="font-bold hover:underline">{p.title}</Link>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-4">
                                        <p className="mb-2">No projects added yet.</p>
                                        <Link href="/projects" className="text-orange-600 hover:underline">Explore Projects</Link>
                                    </div>
                                )}
                            </Section>
                        </section>
                    </div>
                )}
            </div>
        </main>
    );
}