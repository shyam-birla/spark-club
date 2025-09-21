// sanity-studio/schemas/project.js

export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(), // Title zaroori hai
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true, // Image ko better crop karne mein madad karta hai
      },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text', // Lambe text ke liye
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array', // Multiple tags ke liye
      of: [{type: 'string'}],
      options: {
        layout: 'tags', // UI mein tags jaise dikhega
      },
    },
    {
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url', // URL validation ke saath
    },
  ],
};