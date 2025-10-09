const researchProject = {
  name: 'researchProject',
  title: 'Research Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Project Title',
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
        title: 'Project Status',
        type: 'string',
        options: {
            list: [
                { title: 'Ongoing', value: 'ongoing' },
                { title: 'Completed', value: 'completed' },
                { title: 'Published', value: 'published' },
            ],
            layout: 'radio',
        },
        initialValue: 'ongoing',
    },
    {
      name: 'researchArea',
      title: 'Research Area',
      type: 'string',
      description: 'Select the primary domain for this research.',
      options: {
        list: [
          { title: 'Artificial Intelligence & ML', value: 'ai-ml' },
          { title: 'Blockchain & Web3', value: 'blockchain-web3' },
          { title: 'Cybersecurity', value: 'cybersecurity' },
          { title: 'Internet of Things (IoT)', value: 'iot' },
          { title: 'Data Structures & Algorithms', value: 'dsai'},
          { title: 'Other', value: 'other' },
        ],
      },
       validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Abstract / Summary',
      description: 'A short summary of the research project.',
      type: 'blockContent',
    },
    // === YAHAN BADLAV KIYA GAYA HAI ===
    {
      name: 'authors',
      title: 'Student Authors',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'person' } }], // Now references 'person'
    },
    {
      name: 'mentors',
      title: 'Mentors',
      description: 'Faculty or industry mentors guiding this project.',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'member' } }], // Now references 'member'
    },
    // === END OF CHANGE ===
    {
        name: 'publicationLink',
        title: 'Publication Link',
        description: 'If published, link to the paper (e.g., IEEE, arXiv).',
        type: 'url',
    },
    {
      name: 'githubUrl',
      title: 'GitHub Repository URL',
      type: 'url',
    },
    {
        name: 'posterImage',
        title: 'Poster Image',
        description: 'An image/poster for the project card and detail page.',
        type: 'image',
        options: { hotspot: true },
    },
    {
      name: 'isFeatured',
      title: 'Feature on Homepage?',
      type: 'boolean',
      description: 'Enable this to show this research on the homepage.',
      initialValue: false,
    },
  ],
  preview: {
    select: {
        title: 'title',
        subtitle: 'researchArea',
        media: 'posterImage'
    }
  }
};

export default researchProject;