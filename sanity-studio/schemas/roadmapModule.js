// schemas/roadmapModule.js (FINAL VERSION with Sub-Topics)
export default {
  name: 'roadmapModule',
  title: 'Roadmap Module',
  type: 'object',
  fields: [
    { 
      name: 'title', 
      title: 'Module Title', 
      type: 'string', 
      description: 'E.g., "Module 1: Foundations of Web Development"' 
    },
    { 
      name: 'description', 
      title: 'Module Description', 
      type: 'text', 
      description: 'Is module mein kya seekhenge?' 
    },
    {
      name: 'subTopics', // 'resources' ko 'subTopics' se replace kar diya gaya hai
      title: 'Sub-Topics for this module',
      description: 'Content ko groups mein baantein (e.g., "Introduction", "Core Concepts")',
      type: 'array',
      of: [
        {
          name: 'subTopic',
          title: 'Sub-Topic',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Sub-Topic Title',
              type: 'string',
              description: 'E.g., "Understanding HTML Structure" ya "Styling with CSS"',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'resources',
              title: 'Resources for this sub-topic',
              type: 'array',
              of: [{type: 'resource'}], // Resources ab sub-topic ke andar hain
            },
          ],
          // Sanity Studio mein preview ko behtar banane ke liye
          preview: {
            select: {
              title: 'title',
              resourceCount: 'resources.length'
            },
            prepare({ title, resourceCount }) {
              return {
                title: title || 'Untitled Sub-Topic',
                subtitle: `${resourceCount || 0} resource(s)`
              }
            }
          }
        },
      ],
    },
  ],
};