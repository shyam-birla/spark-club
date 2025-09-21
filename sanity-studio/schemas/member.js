// sanity-studio/schemas/member.js

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
      // Example: 'President', 'Developer', 'Designer'
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
    },
    {
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
    },
  ],
};