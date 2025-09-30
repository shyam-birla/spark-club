export default {
  name: 'stream',
  title: 'Stream Roadmap',
  type: 'document',
  fields: [
    { 
      name: 'title', 
      title: 'Title', 
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'isFeatured',
      title: 'Feature on Homepage',
      type: 'boolean',
      description: 'Enable this to show this roadmap on the homepage.',
      initialValue: false,
    },
    {
      name: 'displayOrder',
      title: 'Homepage Display Order',
      type: 'number',
      description: 'A smaller number (like 1, 2) will appear higher up on the homepage.',
      hidden: ({document}) => !document?.isFeatured,
      initialValue: 99,
    },
    // === YAHAN BADLAV KIYA GAYA HAI ===
    {
        name: 'categories',
        title: 'Categories',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'category',
                title: 'Category',
                type: 'reference',
                to: [{ type: 'category' }],
                validation: (Rule) => Rule.required(),
              },
              {
                name: 'displayOrder',
                title: 'Display Order in this Category',
                type: 'number',
                description: 'Is category ke andar yeh roadmap kaunse number par dikhega? (e.g., 1, 2, 3)',
                validation: (Rule) => Rule.required(),
              }
            ],
            // Yeh Sanity Studio mein preview ko behtar banata hai
            preview: {
                select: {
                    title: 'category.title',
                    order: 'displayOrder'
                },
                prepare({ title, order }) {
                    return {
                        title: title || 'No category selected',
                        subtitle: `Order: ${order === undefined ? 'Not set' : order}`
                    }
                }
            }
          }
        ],
        description: 'Is roadmap ko ek ya ek se zyada category se jodein aur har category ke liye order set karein.'
    },
    // === END OF CHANGE ===
    {
      name: 'subtitle',
      title: 'Subtitle / Tagline',
      type: 'string',
      description: 'Roadmap ke liye ek catchy one-liner.'
    },
    { 
      name: 'slug', 
      title: 'Slug', 
      type: 'slug', 
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    },
    { 
      name: 'description', 
      title: 'Short Description', 
      type: 'text', 
      description: 'Yeh roadmap kiske baare mein hai? (Yeh card par dikhega)',
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Roadmap ke card par dikhne waali image.'
    },
    {
      name: 'whatYouWillLearn',
      title: 'What You Will Learn',
      description: 'Bullet points mein batayein ki student kya seekhega.',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      name: 'skills',
      title: 'Skills You Will Gain',
      type: 'array',
      of: [{type: 'reference', to: {type: 'technology'}}],
    },
    {
      name: 'modules',
      title: 'Roadmap Modules',
      type: 'array',
      of: [{type: 'roadmapModule'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'coverImage',
    },
  },
};