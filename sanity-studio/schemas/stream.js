// schemas/stream.js (FINAL, DETAILED VERSION)
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
      name: 'subtitle',
      title: 'Subtitle / Tagline',
      type: 'string',
      description: 'Roadmap ke liye ek catchy one-liner (e.g., "Become a Job-Ready Web Developer from Scratch").'
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
      description: 'Is roadmap se judi technologies/skills select karein.',
      type: 'array',
      of: [{type: 'reference', to: {type: 'technology'}}], // Hum technology schema ko reuse kar rahe hain!
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