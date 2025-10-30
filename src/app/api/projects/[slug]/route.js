
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { client, serverWriteClient } from '../../../../../sanity/lib/client';

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const userEmail = session.user.email;
  const { slug } = await params; // Await params
  const updatedData = await request.json();

  try {
    const project = await client.fetch(`*[_type in ["project", "projectSubmission"] && slug.current == $slug][0]`, { slug });

    if (!project) {
      return new Response(JSON.stringify({ message: 'Project not found' }), { status: 404 });
    }

    const profile = await client.fetch(`*[_type == "profile" && userEmail == $email][0]`, { email: userEmail });

    if (project.author._ref !== profile._id) {
      return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
    }

    // Prepare update object for Sanity
    const patch = {};
    if (updatedData.title) patch.title = updatedData.title;
    if (updatedData.description) patch.description = updatedData.description;
    if (updatedData.tags) patch.tags = updatedData.tags;
    if (updatedData.technologies) patch.technologies = updatedData.technologies;
    if (updatedData.githubUrl) patch.githubUrl = updatedData.githubUrl;
    if (updatedData.liveUrl) patch.liveUrl = updatedData.liveUrl;
    if (updatedData.mainImage) patch.mainImage = updatedData.mainImage;
    if (updatedData.cardImage) patch.cardImage = updatedData.cardImage;
    if (updatedData.galleryImages) patch.galleryImages = updatedData.galleryImages;
    if (updatedData.projectType) patch.projectType = updatedData.projectType;
    if (updatedData.status) patch.status = updatedData.status;
    if (updatedData.soloContributor) patch.soloContributor = updatedData.soloContributor;
    if (updatedData.teamMembers) patch.teamMembers = updatedData.teamMembers;

    await serverWriteClient
      .patch(project._id)
      .set(patch)
      .commit();

    return new Response(JSON.stringify({ message: 'Project updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating project:', error);
    return new Response(JSON.stringify({ message: 'Error updating project', error: error.message }), { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const userEmail = session.user.email;
  const { slug } = await params; // Await params

  try {
    const project = await client.fetch(`*[_type in ["project", "projectSubmission"] && slug.current == $slug][0]`, { slug });

    if (!project) {
      return new Response(JSON.stringify({ message: 'Project not found' }), { status: 404 });
    }

    const profile = await client.fetch(`*[_type == "profile" && userEmail == $email][0]`, { email: userEmail });

    if (project.author._ref !== profile._id) {
      return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
    }

    await client.delete(project._id);

    return new Response(JSON.stringify({ message: 'Project deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return new Response(JSON.stringify({ message: 'Error deleting project' }), { status: 500 });
  }
}
