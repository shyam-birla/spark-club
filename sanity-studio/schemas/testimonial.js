// sanity-studio/schemas/testimonial.js

// Make sure 'export default' is written exactly like this
export default {
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    {
      name: 'quote',
      title: 'Quote',
      type: 'text',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'authorRole',
      title: 'Author Role',
      description: 'E.g., "Member, Class of 2025" or "Alumni"',
      type: 'string',
    },
    {
      name: 'authorImage',
      title: 'Author Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'isFeatured',
      title: 'Show on Homepage?',
      type: 'boolean',
      description: 'Agar isse on karenge, toh yeh testimonial homepage par dikhega.',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: 'quote',
      subtitle: 'authorName',
      media: 'authorImage',
    },
  },
};