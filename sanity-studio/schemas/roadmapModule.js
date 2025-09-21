// sanity-studio/schemas/roadmapModule.js
export default {
  name: 'roadmapModule',
  title: 'Roadmap Module',
  type: 'object',
  fields: [
    { name: 'title', title: 'Module Title', type: 'string', description: 'E.g., "Module 1: Python Basics"' },
    { name: 'description', title: 'Description', type: 'text', description: 'Is module mein kya seekhenge?' },
    {
      name: 'resources',
      title: 'Resources for this module',
      type: 'array',
      of: [{type: 'resource'}], // Yahan hum resource schema ka istemaal kar rahe hain
    },
  ],
}