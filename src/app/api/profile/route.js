// src/app/api/profile/route.js (Full & Corrected Code)



import { NextResponse } from 'next/server';

import { getServerSession } from 'next-auth/next';

import { authOptions } from '../auth/[...nextauth]/route';

import { serverWriteClient } from '../../../../sanity/lib/client';

import { revalidatePath } from 'next/cache';



export async function PUT(request) {

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

        const oldProfiles = await serverWriteClient.fetch(

            `*[_type == "profile" && userEmail == $email && _id != $correctId]`,

            { email: userEmail, correctId: correctProfileId }

        );



        // 4. Start a Sanity transaction

        let tx = serverWriteClient.transaction();



        // 5. If duplicate profiles are found, delete them

        if (oldProfiles && oldProfiles.length > 0) {

            console.log(`Found ${oldProfiles.length} old profiles to delete for ${userEmail}.`);

            oldProfiles.forEach(oldProfile => {

                tx = tx.delete(oldProfile._id);

            });

        }



        // 6. Ensure the main profile document exists

        tx = tx.createIfNotExists({

            _id: correctProfileId,

            _type: 'profile',

            userEmail: userEmail,

            userName: session.user.name,

        });



        // === 7. Update (patch) the main profile with the new data ===

        tx = tx.patch(correctProfileId, (patch) => {

            // First, set all the text and array fields

            patch.set({

                userName: data.userName,

                tagline: data.tagline,

                bio: data.bio,

                linkedinUrl: data.linkedinUrl,

                githubUrl: data.githubUrl,

                portfolioUrl: data.portfolioUrl,

                education: data.education,

                workExperience: data.workExperience,

                externalProjects: data.externalProjects,

            });



            // Now, check if image data exists in the request

            if (data.userImage !== undefined) {

                if (data.userImage === null) {

                    patch.unset(['userImage']); // Remove the image if it's explicitly set to null

                } else if (typeof data.userImage === 'string') {

                    // If userImage is a URL string, extract asset ID

                    const assetId = data.userImage.split('-')[1]; // Assuming URL format is like image-assetId-dimensions.extension

                    patch.set({ userImage: { _type: 'image', asset: { _type: 'reference', _ref: assetId } } });

                } else if (data.userImage._type === 'image' && data.userImage.asset?._ref) {

                    // If it's already a Sanity image object, use it directly

                    patch.set({ userImage: data.userImage });

                }

            }



            return patch; // This is important!

        });

        

        // 8. Commit the transaction

        await tx.commit();



        // 9. Revalidate the cache

        revalidatePath('/profile');



        // 10. Send a success response

        return NextResponse.json({ message: 'Profile updated and old data cleaned successfully' }, { status: 200 });

        

    } catch (error) {

        console.error('Error updating profile with cleanup:', error);

        return NextResponse.json({ message: 'Error updating profile', error: error.message }, { status: 500 });

    }

}
