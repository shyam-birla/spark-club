// sanity-studio/schemas/project.js
export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    // --- FEATURE & ORDER FIELDS ---
    {
      name: 'isFeatured',
      title: 'Feature on Homepage',
      type: 'boolean',
      description: 'Enable this to show the project on the homepage.',
      initialValue: false,
    },
    {
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'A smaller number means higher priority (e.g., 1 will be shown before 2).',
      validation: (Rule) => Rule.required().integer().positive(),
      initialValue: 99,
    },

    // --- EXISTING FIELDS ---
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
    // 'authors' field ko yahan se hata diya gaya hai.
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
      options: { hotspot: true },
      description: 'This is the main image displayed at the top of the project detail page.'
    },
    {
      name: 'cardImage',
      title: 'Card Image (for Project List)',
      type: 'image',
      options: { hotspot: true },
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
      options: { layout: 'tags' },
    },
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
    
    // --- TEAM MEMBERS FIELD UPDATED TO REFERENCE 'member' ---
    {
      name: 'teamMembers',
      title: 'Team Members',
      type: 'array',
      // Ab yeh 'member' schema se data lega
      of: [{ type: 'reference', to: { type: 'member' } }], 
    },
  ],
  orderings: [
    {
      title: 'Manual Order',
      name: 'manualOrder',
      by: [
        {field: 'displayOrder', direction: 'asc'}
      ]
    },
  ]
};
