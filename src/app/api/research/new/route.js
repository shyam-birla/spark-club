
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { client } from '../../../../../sanity/lib/client';

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const { title, status, researchArea, description, publicationLink, githubUrl, posterImage, authors, mentors, newAuthors, newMentors } = await request.json();

  try {
    const newAuthorRefs = [];
    if (newAuthors && newAuthors.length > 0) {
      for (const author of newAuthors) {
        let imageAsset;
        if (author.image) {
          imageAsset = await client.assets.upload('image', author.image);
        }

        const newPerson = {
          _type: 'person',
          name: author.name,
          role: author.role,
          image: imageAsset ? { _type: 'image', asset: { _type: 'reference', _ref: imageAsset._id } } : null,
        };
        const createdPerson = await client.create(newPerson);
        newAuthorRefs.push({ _type: 'reference', _ref: createdPerson._id });
      }
    }

    const newMentorRefs = [];
    if (newMentors && newMentors.length > 0) {
      for (const mentor of newMentors) {
        let imageAsset;
        if (mentor.image) {
          imageAsset = await client.assets.upload('image', mentor.image);
        }

        const newPerson = {
          _type: 'person',
          name: mentor.name,
          role: mentor.role,
          image: imageAsset ? { _type: 'image', asset: { _type: 'reference', _ref: imageAsset._id } } : null,
        };
        const createdPerson = await client.create(newPerson);
        newMentorRefs.push({ _type: 'reference', _ref: createdPerson._id });
      }
    }

    const allAuthors = [...authors.map(authorId => ({ _type: 'reference', _ref: authorId })), ...newAuthorRefs];
    const allMentors = [...mentors.map(mentorId => ({ _type: 'reference', _ref: mentorId })), ...newMentorRefs];

    let posterImageAsset;
    if (posterImage) {
      posterImageAsset = await client.assets.upload('image', posterImage);
    }

    const newResearchProject = {
      _type: 'researchProject',
      title,
      slug: { _type: 'slug', current: title.toLowerCase().replace(/\s+/g, '-').slice(0, 96) },
      status,
      researchArea,
      description: [{ _type: 'block', children: [{ _type: 'span', text: description }] }],
      publicationLink,
      githubUrl,
      posterImage: posterImageAsset ? { _type: 'image', asset: { _type: 'reference', _ref: posterImageAsset._id } } : null,
      authors: allAuthors,
      mentors: allMentors,
      approvalStatus: 'pending_approval',
    };

    const createdResearchProject = await client.create(newResearchProject);

    return new Response(JSON.stringify(createdResearchProject), { status: 201 });
  } catch (error) {
    console.error('Error creating research project:', error);
    return new Response(JSON.stringify({ message: 'Error creating research project' }), { status: 500 });
  }
}
