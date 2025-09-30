'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Roadmap Card component ko is file mein bhi define karna hoga
const RoadmapCard = ({ roadmap }) => (
    <Link href={`/resources/${roadmap.slug}`} className="block h-full">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-full transform transition-all duration-300 hover:shadow-xl hover:scale-[1.03] group">
            <div className="relative w-full h-48">
                {roadmap.coverImageUrl ? (
                    <Image src={roadmap.coverImageUrl} alt={`${roadmap.title} cover image`} fill className="object-cover" />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center"><span className="text-gray-500">No Image</span></div>
                )}
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-2 group-hover:text-orange-600 transition-colors">{roadmap.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">{roadmap.description}</p>
            </div>
        </div>
    </Link>
);

export default function CategoryList({ categories }) {
    // Yeh state track karega ki kaun si category expanded hai
    const [expandedCategories, setExpandedCategories] = useState({});

    const toggleCategory = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    return (
        <div className="space-y-16">
            {categories.map((category) => {
                if (!category.roadmaps || category.roadmaps.length === 0) {
                    return null;
                }

                const isExpanded = expandedCategories[category._id];
                const displayedRoadmaps = isExpanded ? category.roadmaps : category.roadmaps.slice(0, 3);
                
                return (
                    <section key={category._id}>
                        <h2 className="text-3xl font-bold text-black border-b pb-4 mb-8">{category.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayedRoadmaps.map((roadmap) => (
                                <RoadmapCard key={roadmap._id} roadmap={roadmap} />
                            ))}
                        </div>

                        {/* Agar 3 se zyada roadmaps hain, toh button dikhayein */}
                        {category.roadmaps.length > 3 && (
                            <div className="text-center mt-8">
                                <button 
                                    onClick={() => toggleCategory(category._id)}
                                    className="bg-black text-white px-6 py-2 rounded-md font-semibold hover:opacity-80 transition-opacity"
                                >
                                    {isExpanded ? 'Show Less' : 'Show More'}
                                </button>
                            </div>
                        )}
                    </section>
                )
            })}
        </div>
    );
}