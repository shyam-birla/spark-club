// src/app/api/progress/route.js (FINAL ROBUST VERSION)

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { createClient } from 'next-sanity';
import { revalidatePath } from 'next/cache';

const sanityWriteClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2023-05-03',
    useCdn: false,
    token: process.env.SANITY_API_WRITE_TOKEN,
});

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const { roadmapId, resourceKey } = await request.json();
    if (!roadmapId || !resourceKey) {
        return NextResponse.json({ message: 'Missing roadmapId or resourceKey' }, { status: 400 });
    }

    const userEmail = session.user.email;
    const sanitizedEmail = userEmail.replace(/[\.@]/g, '-');
    const documentId = `progress-${sanitizedEmail}-${roadmapId}`;
    
    try {
        // --- YEH NAYA, SAFER TAREEKA HAI ---

        // Step 1: Pehle document ko create karo agar woh nahi hai (createIfNotExists)
        // Isse ensure hoga ki patch karne se pehle document hamesha maujood hai
        await sanityWriteClient.createIfNotExists({
            _id: documentId,
            _type: 'userProgress',
            userEmail: userEmail,
            roadmap: { _type: 'reference', _ref: roadmapId },
            completedResources: [],
        });

        // Step 2: Ab us document ko safely patch (update) karo
        await sanityWriteClient
            .patch(documentId)
            .set({ lastUpdated: new Date().toISOString() }) // Har update par date set karo
            // Hum 'append' ki jagah 'insert' ka use karenge taaki duplicate entries na hon
            .insert('after', 'completedResources[-1]', [resourceKey])
            .commit({ autoGenerateArrayKeys: true });

        // --- END OF CHANGE ---

        // Profile page ka cache clear karo taaki wahan "Resume Learning" button update ho
        revalidatePath('/profile');

        return NextResponse.json({ message: 'Progress updated successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error updating progress:', error);
        return NextResponse.json({ message: 'Error updating progress', error: error.message }, { status: 500 });
    }
}