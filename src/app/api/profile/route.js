// src/app/api/profile/route.js (Full & Updated Code)

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { createClient } from 'next-sanity';
import { revalidatePath } from 'next/cache';

// Sanity client with write permissions
const sanityWriteClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2023-05-03',
    useCdn: false, // `false` for write operations
    token: process.env.SANITY_API_WRITE_TOKEN, // Make sure this token has write permissions
});

export async function POST(request) {
    // 1. Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const data = await request.json();

    // 2. Create a predictable, unique ID for the user's profile
    const sanitizedEmail = userEmail.replace(/[\.@]/g, '-');
    const correctProfileId = `profile-${sanitizedEmail}`;

    try {
        // 3. Find any old, duplicate profiles for the same user
        // These are profiles with the same email but a different (likely random) _id
        const oldProfiles = await sanityWriteClient.fetch(
            `*[_type == "profile" && userEmail == $email && _id != $correctId]`,
            { email: userEmail, correctId: correctProfileId }
        );

        // 4. Start a Sanity transaction to perform multiple operations atomically
        let tx = sanityWriteClient.transaction();

        // 5. If duplicate profiles are found, add 'delete' operations to the transaction
        if (oldProfiles && oldProfiles.length > 0) {
            console.log(`Found ${oldProfiles.length} old profiles to delete for ${userEmail}.`);
            oldProfiles.forEach(oldProfile => {
                tx = tx.delete(oldProfile._id);
            });
        }

        // 6. Ensure the main profile document exists (Create if it doesn't)
        tx = tx.createIfNotExists({
            _id: correctProfileId,
            _type: 'profile',
            userEmail: userEmail,
            userName: session.user.name, // Default name from session
        });

        // 7. Update (patch) the main profile with the new data from the form
        tx = tx.patch(correctProfileId, (patch) =>
            patch.set({
                // Basic info
                userName: data.userName,
                tagline: data.tagline,
                bio: data.bio,
                linkedinUrl: data.linkedinUrl,
                githubUrl: data.githubUrl,
                portfolioUrl: data.portfolioUrl,
                
                // Array-based fields
                education: data.education,
                workExperience: data.workExperience,
                externalProjects: data.externalProjects,
            })
        );
        
        // 8. Commit the transaction: all operations (delete, create, patch) run at once
        await tx.commit();

        // 9. Revalidate the profile page cache to show updated data immediately
        revalidatePath('/profile');

        // 10. Send a success response
        return NextResponse.json({ message: 'Profile updated and old data cleaned successfully' }, { status: 200 });
        
    } catch (error) {
        console.error('Error updating profile with cleanup:', error);
        return NextResponse.json({ message: 'Error updating profile', error: error.message }, { status: 500 });
    }
}
