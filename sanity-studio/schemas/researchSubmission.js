
export default {
  name: 'researchSubmission',
  title: 'Research Submission',
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
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'H5', value: 'h5' },
            { title: 'H6', value: 'h6' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [{ title: 'Bullet', value: 'bullet' }],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'URL',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Ongoing', value: 'ongoing' },
          { title: 'Completed', value: 'completed' },
          { title: 'Published', value: 'published' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'researchArea',
      title: 'Research Area',
      type: 'string',
      options: {
        list: [
          { title: 'AI/ML', value: 'ai-ml' },
          { title: 'Blockchain/Web3', value: 'blockchain-web3' },
          { title: 'Cybersecurity', value: 'cybersecurity' },
          { title: 'IoT', value: 'iot' },
          { title: 'Data Science & AI', value: 'dsai' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'publicationLink',
      title: 'Publication Link',
      type: 'url',
    },
    {
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
    },
    {
      name: 'posterImage',
      title: 'Poster Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'authors',
      title: 'Authors',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'profileRef',
              title: 'Profile',
              type: 'reference',
              to: [{ type: 'person' }],
            },
            {
              name: 'projectRole',
              title: 'Role in Project',
              type: 'string',
            },
          ],
          preview: {
            select: {
              title: 'profileRef.name',
              subtitle: 'projectRole',
              media: 'profileRef.image',
            },
          },
        },
      ],
    },
    {
      name: 'mentors',
      title: 'Mentors',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'profileRef',
              title: 'Profile',
              type: 'reference',
              to: [{ type: 'person' }],
            },
            {
              name: 'projectRole',
              title: 'Role in Project',
              type: 'string',
            },
          ],
          preview: {
            select: {
              title: 'profileRef.name',
              subtitle: 'projectRole',
              media: 'profileRef.image',
            },
          },
        },
      ],
    },
    {
      name: 'approvalStatus',
      title: 'Approval Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending Approval', value: 'pending_approval' },
          { title: 'Approved', value: 'approved' },
          { title: 'Rejected', value: 'rejected' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'pending_approval',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'researchArea',
      media: 'posterImage',
    },
  },
};
