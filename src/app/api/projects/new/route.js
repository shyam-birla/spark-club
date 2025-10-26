
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { client } from '../../../../../sanity/lib/client';

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const { title, description, tags, technologies, githubUrl, liveUrl, mainImage, cardImage, teamMembers, nonMemberContributors } = await request.json();
  const userEmail = session.user.email;

  try {
    const profile = await client.fetch(`*[_type == "profile" && userEmail == $email][0]`, { email: userEmail });

    if (!profile) {
      return new Response(JSON.stringify({ message: 'Profile not found' }), { status: 404 });
    }

    const newPersonRefs = [];
    if (nonMemberContributors && nonMemberContributors.length > 0) {
      for (const contributor of nonMemberContributors) {
        let imageAsset;
        if (contributor.image) {
          imageAsset = await client.assets.upload('image', contributor.image);
        }

        const newPerson = {
          _type: 'person',
          name: contributor.name,
          role: contributor.role,
          linkedinUrl: contributor.linkedinUrl,
          githubUrl: contributor.githubUrl,
          image: imageAsset ? { _type: 'image', asset: { _type: 'reference', _ref: imageAsset._id } } : null,
        };
        const createdPerson = await client.create(newPerson);
        newPersonRefs.push({ _type: 'reference', _ref: createdPerson._id });
      }
    }

    const allTeamMembers = [...teamMembers.map(memberId => ({ _type: 'reference', _ref: memberId })), ...newPersonRefs];

    const newProject = {
      _type: 'project',
      title,
      slug: { _type: 'slug', current: title.toLowerCase().replace(/\s+/g, '-').slice(0, 96) },
      author: { _type: 'reference', _ref: profile._id },
      description: [{ _type: 'block', children: [{ _type: 'span', text: description }] }],
      tags: tags.split(',').map(tag => tag.trim()),
      technologies: [], // We'll handle this later
      githubUrl,
      liveUrl,
      mainImage,
      cardImage,
      teamMembers: allTeamMembers,
      approvalStatus: 'pending_approval',
    };

    const createdProject = await client.create(newProject);

    return new Response(JSON.stringify(createdProject), { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return new Response(JSON.stringify({ message: 'Error creating project' }), { status: 500 });
  }
}
