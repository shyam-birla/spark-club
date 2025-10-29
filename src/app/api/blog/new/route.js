import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { serverWriteClient } from '../../../../../sanity/lib/client';
import { v4 as uuidv4 } from 'uuid';
import { htmlToBlocks } from '@portabletext/block-tools';
import { JSDOM } from 'jsdom';

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const { title, slug, category, coverImage, body, author, approvalStatus } = await request.json();
  const userEmail = session.user.email;

  try {
    let authorRef = null;

    if (author && author._type === 'reference') {
      // Frontend sent an existing profile reference
      authorRef = author;
    } else if (author && author.name) {
      // Frontend sent custom author details, create a new person document
      const newPerson = {
        _type: 'person',
        name: author.name,
        linkedinUrl: author.linkedinUrl,
        githubUrl: author.githubUrl,
        portfolioUrl: author.portfolioUrl,
        // Image handling for person document:
        // If author.image is a URL, we'd need to upload it to Sanity assets first.
        // For simplicity, we'll skip image for now or assume person schema can store URL.
        // The person schema has 'image' as type 'image', so we can't directly store a URL.
        // For now, we'll omit the image field when creating a person from custom details.
      };
      const createdPerson = await serverWriteClient.create(newPerson);
      authorRef = { _type: 'reference', _ref: createdPerson._id };
    } else {
      // Fallback to logged-in user's profile if no author details provided
      const profile = await serverWriteClient.fetch(`*[_type == "profile" && userEmail == $email][0]`, { email: userEmail });
      if (profile) {
        authorRef = { _type: 'reference', _ref: profile._id };
      } else {
        return new Response(JSON.stringify({ message: 'Author profile not found and no custom author provided' }), { status: 400 });
      }
    }

    let finalCoverImage = null;
    if (coverImage) {
      // Client has already uploaded the image and sent the asset reference
      finalCoverImage = coverImage;
    }

    // ... (rest of the code)

    const htmlContent = body;
    const { document } = new JSDOM(htmlContent).window;
    const blocks = await htmlToBlocks(document.body, { 
      // Optional: define your schema types for images, etc.
      // This is a basic example, you might need to customize it based on your Sanity schema
      schema: {
        block: { 
          marks: { 
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              { name: 'link', type: 'object', fields: [{ name: 'href', type: 'url' }] },
            ],
          },
        },
        image: {
          // Define how images should be handled if they are part of the Portable Text
          // This is a placeholder, you might need to adjust based on your Sanity image schema
          fields: [
            { name: 'asset', type: 'reference', to: [{ type: 'sanity.imageAsset' }] },
          ],
        },
      },
    });

    console.log('Constructed authorRef:', authorRef);

    const newBlogSubmission = {
      _type: 'blogSubmission',
      title,
      slug: { _type: 'slug', current: title.toLowerCase().replace(/\s+/g, '-').slice(0, 96) },
      category,
      author: authorRef,
      coverImage: finalCoverImage,
      body: blocks, // Use the generated Portable Text blocks
      approvalStatus: 'pending_approval',
    };

    const createdBlogSubmission = await serverWriteClient.create(newBlogSubmission);

    return new Response(JSON.stringify(createdBlogSubmission), { status: 201 });
  } catch (error) {
    console.error('Error creating blog submission:', error);
    return new Response(JSON.stringify({ message: 'Error creating blog submission' }), { status: 500 });
  }
}