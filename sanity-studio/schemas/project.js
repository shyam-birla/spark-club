// sanity-studio/schemas/project.js

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
    // NEW: Project ka status (Completed / In Progress)
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
        layout: 'radio', // Radio buttons ki tarah dikhega
      },
      initialValue: 'in-progress', // Default value
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    // IMPROVED: Description ko Rich Text banaya
    {
      name: 'description',
      title: 'Description',
      type: 'array', // 'text' se 'array' kiya
      of: [
        { 
          type: 'block', // Yeh Rich Text enable karta hai (headings, bold, lists, etc.)
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
          ],
        },
        { type: 'image' } // Description ke beech mein image add karne ke liye
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
    {
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
    },
    // NEW: Live Demo ka URL add karne ke liye
    {
      name: 'liveUrl',
      title: 'Live Demo URL',
      type: 'url',
    },
    // NEW: Project team members ko add karne ke liye
    // Iske liye aapko 'person' naam ka ek naya schema banana hoga
    {
      name: 'teamMembers',
      title: 'Team Members',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'person' } }],
    },
  ],
};