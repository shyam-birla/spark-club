// src/app/learn/[slug]/page.js (FINAL ROBUST VERSION)

import { client } from '../../../../sanity/lib/client';
import LearningInterface from '@/components/LearningInterface';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function LearnPage({ params }) {
    const { slug } = params;

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
    const roadmap = await client.fetch(roadmapQuery, { slug });

    if (!roadmap) {
        return (
            <main className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">Roadmap Not Found</h1>
                    <p className="text-gray-600 mt-4">Sorry, we couldn't find the roadmap you're looking for.</p>
                </div>
            </main>
        );
    }

    // 2. User ka progress fetch karo
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    const roadmapId = roadmap._id;
    let initialProgress = [];

    if (userEmail && roadmapId) {
        const progressQuery = `*[_type == "userProgress" && userEmail == $email && roadmap._ref == $roadmapId][0]{
            completedResources
        }`;
        try {
            const progress = await client.fetch(progressQuery, { email: userEmail, roadmapId });
            initialProgress = progress?.completedResources || [];
        } catch (error) {
            console.error("Failed to fetch user progress:", error);
        }
    }
    
    // 3. Saara data Client Component ko pass karo
    return <LearningInterface roadmap={roadmap} initialProgress={initialProgress} />;
}