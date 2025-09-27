// src/app/learn/[slug]/page.js (FINAL CLIENT-SIDE FETCHING VERSION)
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Naya hook import kiya
import { useSession } from 'next-auth/react';
import { client } from '../../../../sanity/lib/client';
import LearningInterface from '@/components/LearningInterface';

export default function LearnPage() {
    const params = useParams(); // Hook ka use karke params get kiye
    const slug = params.slug;

    // Saari state ab is page par manage hogi
    const { data: session } = useSession();
    const [roadmap, setRoadmap] = useState(null);
    const [initialProgress, setInitialProgress] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Yeh effect slug ya session badalne par data fetch karega
        if (!slug) return;

        async function fetchData() {
            setLoading(true);
            try {
                // 1. Roadmap ka data fetch karo
                const roadmapQuery = `*[_type == "stream" && slug.current == $slug][0]{
                    _id,
                    title,
                    modules[]{
                        _key,
                        title,
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
                                "fileURL": fileUpload.asset->url,
                                articleBody,
                                files[]{
                                    _key,
                                    title,
                                    "fileURL": fileUpload.asset->url
                                }
                            }
                        }
                    }
                }`;
                const roadmapData = await client.fetch(roadmapQuery, { slug });
                setRoadmap(roadmapData);

                // 2. User ka progress fetch karo
                const userEmail = session?.user?.email;
                const roadmapId = roadmapData?._id;
                
                if (userEmail && roadmapId) {
                    const progressQuery = `*[_type == "userProgress" && userEmail == $email && roadmap._ref == $roadmapId][0]{ completedResources }`;
                    const progress = await client.fetch(progressQuery, { email: userEmail, roadmapId });
                    setInitialProgress(progress?.completedResources || []);
                } else {
                    setInitialProgress([]); // Agar user login nahi hai, to progress empty set karo
                }

            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [slug, session]); // Dependency array mein session bhi add kiya

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!roadmap) {
        return (
            <main className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">Roadmap Not Found</h1>
                    <p className="text-gray-600 mt-4">Sorry, we couldn&apos;t find the roadmap you&apos;re looking for.</p>
                </div>
            </main>
        );
    }

    // Saara data Client Component ko pass karo
    return <LearningInterface roadmap={roadmap} initialProgress={initialProgress} />;
}