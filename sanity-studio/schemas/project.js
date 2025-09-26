export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Completed', value: 'completed' },
          { title: 'In Progress', value: 'in-progress' },
          { title: 'Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'in-progress',
    },
    {
      name: 'mainImage',
      title: 'Main Project Image (for Detail Page)',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'This is the main image displayed at the top of the project detail page.'
    },
    {
      name: 'cardImage',
      title: 'Card Image (for Project List)',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'This image appears on the project card in the list of all projects. Should be a poster-style image.'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        { 
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
          ],
        },
        { type: 'image' }
      ],
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    },
    // === NAYA "TECHNOLOGIES" FIELD YAHAN ADD KIYA GAYA HAI ===
    {
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'technology' } }],
      description: 'Is project mein use hui technologies select karein.'
    },
    {
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
    },
    {
      name: 'liveUrl',
      title: 'Live Demo URL',
      type: 'url',
    },
    {
      name: 'teamMembers',
      title: 'Team Members',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'person' } }], // Note: This references 'person', make sure you have a 'person' schema.
    },
  ],
};