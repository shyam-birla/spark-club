
import { v4 as uuidv4 } from 'uuid';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { serverWriteClient } from '../../../../../sanity/lib/client';

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const { title, description, tags, technologies, githubUrl, liveUrl, mainImage, cardImage, teamMembers, nonMemberContributors, projectType, status, galleryImages, soloContributor } = await request.json();
  console.log('Received galleryImages:', galleryImages);
  const userEmail = session.user.email;

  try {
    const profile = await serverWriteClient.fetch(`*[_type == "profile" && userEmail == $email][0]`, { email: userEmail });

    if (!profile) {
      return new Response(JSON.stringify({ message: 'Profile not found' }), { status: 404 });
    }

    const newPersonRefs = [];
    if (nonMemberContributors && nonMemberContributors.length > 0) {
      for (const contributor of nonMemberContributors) {
        let imageAsset;
        if (contributor.image) {
          imageAsset = await serverWriteClient.assets.upload('image', contributor.image);
        }

        const newPerson = {
          _type: 'person',
          name: contributor.name,
          role: contributor.role,
          linkedinUrl: contributor.linkedinUrl,
          githubUrl: contributor.githubUrl,
          image: imageAsset ? { _type: 'image', asset: { _type: 'reference', _ref: imageAsset._id } } : null,
        };
        const createdPerson = await serverWriteClient.create(newPerson);
        newPersonRefs.push({
          profileRef: { _type: 'reference', _ref: createdPerson._id },
          projectRole: contributor.role,
          isTeamLead: false, // Default for non-member contributors
        });
      }
    }

    const allTeamMembers = [...teamMembers, ...newPersonRefs];

    const newProject = {
      _type: 'projectSubmission',
      title,
      slug: { _type: 'slug', current: title.toLowerCase().replace(/\s+/g, '-').slice(0, 96) },
      author: { _type: 'reference', _ref: profile._id },
      description: [{ _key: uuidv4(), _type: 'block', children: [{ _type: 'span', text: description.replace(/<[^>]*>?/gm, '') }] }],
      tags: Array.isArray(tags) ? tags.map(tag => String(tag).trim()) : [],
      technologies: technologies.map(techId => ({ _key: uuidv4(), _type: 'reference', _ref: techId })),
      githubUrl,
      liveUrl,
      mainImage,
      cardImage,
      galleryImages,
      projectType,
      status,
      approvalStatus: 'pending_approval',
      ...(projectType === 'solo' && soloContributor ? { soloContributor: soloContributor } : {}),
      ...(projectType === 'team' && allTeamMembers.length > 0 ? { teamMembers: allTeamMembers } : {}),
    };

    const createdProject = await serverWriteClient.create(newProject);

    return new Response(JSON.stringify(createdProject), { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return new Response(JSON.stringify({ message: 'Error creating project' }), { status: 500 });
  }
}
