// src/components/ProfileClient.js
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaAward } from 'react-icons/fa';

export default function ProfileClient({ session, completedRoadmaps }) {

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    return (
        <main className="container mx-auto px-4 py-12 md:py-20">
            {/* --- Profile Header --- */}
            <motion.div 
                className="flex flex-col sm:flex-row items-center gap-6 mb-12 p-6 bg-white rounded-xl border border-gray-200 shadow-sm"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {session.user.image && (
                    <Image 
                        src={session.user.image} 
                        alt={session.user.name}
                        width={100} 
                        height={100} 
                        className="rounded-full border-4 border-orange-200 shadow-lg"
                    />
                )}
                <div className="text-center sm:text-left">
                    <h1 className="text-4xl font-bold text-black">{session.user.name}</h1>
                    <p className="text-lg text-gray-500">{session.user.email}</p>
                </div>
            </motion.div>

            <div>
                <h2 className="text-3xl font-bold text-black border-b pb-4 mb-8">Completed Roadmaps & Skills</h2>
                
                {completedRoadmaps && completedRoadmaps.length > 0 ? (
                    <motion.div 
                        className="space-y-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {completedRoadmaps.map(progress => (
                            <motion.div key={progress.roadmap._id} variants={itemVariants}>
                                <div className="bg-white p-6 rounded-lg border border-gray-200 transition-shadow hover:shadow-lg">
                                    <div className="flex items-center gap-4 mb-4">
                                        <FaAward className="text-3xl text-yellow-500 flex-shrink-0" />
                                        <h3 className="text-2xl font-semibold text-orange-600">
                                            <Link href={`/learn/${progress.roadmap.slug}`} className="hover:underline">
                                                {progress.roadmap.title}
                                            </Link>
                                        </h3>
                                    </div>
                                    <p className="text-gray-600 mb-4">Skills Gained:</p>
                                    <div className="flex flex-wrap gap-3">
                                        {progress.roadmap.skills?.map((skill) => (
                                            <span key={skill._id} className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded-full font-medium flex items-center gap-2 text-sm">
                                                {skill.logoUrl && (
                                                    <Image src={skill.logoUrl} alt={`${skill.name} logo`} width={16} height={16} />
                                                )}
                                                {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div 
                        className="text-center py-16 bg-gray-50 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <p className="text-xl text-gray-500">No roadmaps completed yet.</p>
                        <p className="mt-2 text-gray-400">Keep learning to earn skill badges!</p>
                        <Link href="/resources">
                            <button className="mt-6 bg-black text-white px-6 py-2 rounded-md font-semibold hover:opacity-80 transition-transform hover:scale-105">
                                Explore Roadmaps
                            </button>
                        </Link>
                    </motion.div>
                )}
            </div>
        </main>
    );
}