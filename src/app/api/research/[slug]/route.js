import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { client, serverWriteClient } from '../../../../../sanity/lib/client';

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const userEmail = session.user.email;
  const { slug } = params;
  const updatedData = await request.json();

  try {
    const researchProject = await client.fetch(`*[_type == "researchProject" && slug.current == $slug][0]`, { slug });

    if (!researchProject) {
      return new Response(JSON.stringify({ message: 'Research project not found' }), { status: 404 });
    }

    const profile = await client.fetch(`*[_type == "profile" && userEmail == $email][0]`, { email: userEmail });

    if (researchProject.author._ref !== profile._id) {
      return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
    }

    // Prepare update object for Sanity
    const patch = {};
    if (updatedData.title) patch.title = updatedData.title;
    if (updatedData.description) patch.description = updatedData.description;
    if (updatedData.status) patch.status = updatedData.status;
    if (updatedData.researchArea) patch.researchArea = updatedData.researchArea;
    if (updatedData.publicationLink) patch.publicationLink = updatedData.publicationLink;
    if (updatedData.githubUrl) patch.githubUrl = updatedData.githubUrl;
    if (updatedData.posterImage) patch.posterImage = updatedData.posterImage;
    if (updatedData.authors) patch.authors = updatedData.authors;
    if (updatedData.mentors) patch.mentors = updatedData.mentors;

    await serverWriteClient
      .patch(researchProject._id)
      .set(patch)
      .commit();

    return new Response(JSON.stringify({ message: 'Research project updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating research project:', error);
    return new Response(JSON.stringify({ message: 'Error updating research project' }), { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const userEmail = session.user.email;
  const { slug } = params;

  try {
    const researchProject = await client.fetch(`*[_type == "researchProject" && slug.current == $slug][0]`, { slug });

    if (!researchProject) {
      return new Response(JSON.stringify({ message: 'Research project not found' }), { status: 404 });
    }

    const profile = await client.fetch(`*[_type == "profile" && userEmail == $email][0]`, { email: userEmail });

    if (researchProject.author._ref !== profile._id) {
      return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
    }

    await client.delete(researchProject._id);

    return new Response(JSON.stringify({ message: 'Research project deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting research project:', error);
    return new Response(JSON.stringify({ message: 'Error deleting research project' }), { status: 500 });
  }
}
