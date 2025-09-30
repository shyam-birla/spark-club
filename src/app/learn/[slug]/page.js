'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { client } from '../../../../sanity/lib/client';
import LearningInterface from '@/components/LearningInterface';

export default function LearnPage() {
    const params = useParams();
    const slug = params.slug;

    const { data: session } = useSession();
    const [roadmap, setRoadmap] = useState(null);
    const [initialProgress, setInitialProgress] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        async function fetchData() {
            setLoading(true);
            try {
                console.log("1. Fetching roadmap for slug:", slug);
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
                console.log("2. Roadmap data fetched:", roadmapData);

                const userEmail = session?.user?.email;
                const roadmapId = roadmapData?._id;
                console.log("3. Checking for progress with Email:", userEmail, "and Roadmap ID:", roadmapId);

                if (userEmail && roadmapId) {
                    const progressQuery = `*[_type == "userProgress" && userEmail == $email && roadmap._ref == $roadmapId][0]{ completedResources }`;
                    const progress = await client.fetch(progressQuery, { email: userEmail, roadmapId });
                    console.log("4. Progress data fetched from Sanity:", progress);
                    setInitialProgress(progress?.completedResources || []);
                } else {
                    console.log("User not logged in or roadmap not found, setting progress to empty.");
                    setInitialProgress([]);
                }

            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [slug, session]);

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

    return <LearningInterface roadmap={roadmap} initialProgress={initialProgress} />;
}