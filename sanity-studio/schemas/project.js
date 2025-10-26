// sanity-studio/schemas/project.js
const project = {
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
    {
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      options: {
        list: [
          { title: 'Solo Project', value: 'solo' },
          { title: 'Team Project', value: 'team' },
        ],
        layout: 'radio',
      },
      initialValue: 'team',
    },
    {
      name: 'soloContributor',
      title: 'Solo Contributor',
      type: 'object',
      fields: [
        {
          name: 'profileRef',
          title: 'Contributor Profile',
          type: 'reference',
          to: [{ type: 'profile' }],
        },
        {
          name: 'projectRole',
          title: 'Role in Project',
          type: 'string',
        },
      ],
      hidden: ({ parent }) => parent?.projectType !== 'solo',
    },
    {
      name: 'teamMembers',
      title: 'Team Members',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'profileRef',
              title: 'Member Profile',
              type: 'reference',
              to: [{ type: 'profile' }],
            },
            {
              name: 'projectRole',
              title: 'Role in Project',
              type: 'string',
            },
            {
              name: 'isTeamLead',
              title: 'Team Lead',
              type: 'boolean',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              title: 'profileRef.name',
              subtitle: 'projectRole',
              isTeamLead: 'isTeamLead',
            },
            prepare({ title, subtitle, isTeamLead }) {
              return {
                title: `${title}${isTeamLead ? ' (Lead)' : ''}`,
                subtitle,
              };
            },
          },
        },
      ],
      hidden: ({ parent }) => parent?.projectType !== 'team',
    },

    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Completed', value: 'completed' },
          { title: 'In Progress', value: 'in-progress' },
          { title: 'Upcoming', value: 'upcoming' },
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
      name: 'galleryImages',
      title: 'Project Gallery Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Additional images for the project detail page gallery.'
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
    {
      name: 'approvalStatus',
      title: 'Approval Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Pending Approval', value: 'pending_approval' },
          { title: 'Published', value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'published',
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

export default project;
