// sanity-studio/schemas/stream.js

// 👉 Yeh line sabse zaroori hai
export default {
  name: 'stream',
  title: 'Stream Roadmap',
  type: 'document',
  fields: [
    { 
      name: 'title', 
      title: 'Title', 
      type: 'string' 
    },
    { 
      name: 'slug', 
      title: 'Slug', 
      type: 'slug', 
      options: { source: 'title' } 
    },
    { 
      name: 'description', 
      title: 'Short Description', 
      type: 'text', 
      description: 'Yeh roadmap kiske baare mein hai?' 
    },
    {
      name: 'modules',
      title: 'Roadmap Modules',
      type: 'array',
      of: [{type: 'roadmapModule'}],
    },
  ],
}