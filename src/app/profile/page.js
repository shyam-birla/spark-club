// src/app/profile/page.js (FINAL - Fetches ALL profile data with correct technology field name)

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { client } from '../../../sanity/lib/client';
import { redirect } from 'next/navigation';
import ProfileClient from '@/components/ProfileClient';

// Update GROQ query to expand technology references using the correct field 'name'
async function getFullUserProfile(email) {
    if (!email) return null;

    const query = `*[_type == "profile" && userEmail == $email][0]{
        ...,
        // Projects authored by user
        "projects": *[_type == "project" && references(^._id)]{
            ...,
            // Project technologies (expanded) - using 'name'
            "technologies": technologies[]->{
                _id,
                name, // Correct field name
                logo
            }
        },
        // Personal/external projects - expand technologies here! - using 'name'
        "externalProjects": externalProjects[]{
            ...,
            "technologies": technologies[]->{
                _id,
                name, // Correct field name
                logo
            }
        },
        // Completed roadmaps by this user
        "completedRoadmaps": *[_type == "userProgress" && userEmail == $email && count(completedResources) > 0] {
            lastUpdated,
            roadmap->{
                _id,
                title,
                "slug": slug.current,
                "totalResources": count(modules[].subTopics[].resources[])
            },
            "completedCount": count(completedResources)
        } | order(lastUpdated desc)
    }`;

    const profileData = await client.fetch(query, { email });
    return profileData;
}


export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        redirect('/login');
    }

    const profileData = await getFullUserProfile(session.user.email);
    return <ProfileClient session={session} profileData={profileData} />;
}
