export default {
  name: 'member',
  title: 'Member',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'role',
      title: 'Role / Position',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      // Validation add kiya taaki sahi URL hi enter ho
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https']
      }),
    },
    {
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
      // Validation add kiya taaki sahi URL hi enter ho
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https']
      }),
    },
    // Naya Instagram field add kiya
    {
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https']
      }),
    },
    {
      name: 'bio',
      title: 'Biography',
      type: 'blockContent',
    },
  ],
};