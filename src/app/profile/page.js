// src/app/profile/page.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { client } from '../../../sanity/lib/client';
import { redirect } from 'next/navigation';
import ProfileClient from '@/components/ProfileClient'; // Naya component import karein

async function getUserProfileData(email) {
    if (!email) return null;
    const query = `*[_type == "userProgress" && userEmail == $email]{
        roadmap->{
            _id,
            title,
            "slug": slug.current,
            "totalResources": count(modules[].subTopics[].resources[]),
            "skills": skills[]->{_id, name, "logoUrl": logo.asset->url}
        },
        "completedCount": count(completedResources)
    }`;
    const progressList = await client.fetch(query, { email });
    
    const completedRoadmaps = progressList.filter(progress => {
        if (!progress.roadmap) return false;
        return progress.completedCount > 0 && progress.completedCount === progress.roadmap.totalResources;
    });
    return completedRoadmaps;
}

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/login');
    }
    const completedRoadmaps = await getUserProfileData(session.user.email);
    
    // Server component ab sirf data pass kar raha hai
    return <ProfileClient session={session} completedRoadmaps={completedRoadmaps} />;
}