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