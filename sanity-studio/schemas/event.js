// schemas/event.js (FINAL - With Categories & New Registration Status)
export default {
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    { 
      name: 'title', 
      title: 'Event Title', 
      type: 'string', 
      validation: (Rule) => Rule.required() 
    },
    { 
      name: 'slug', 
      title: 'Slug', 
      type: 'slug', 
      options: { source: 'title' }, 
      validation: (Rule) => Rule.required() 
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
      description: 'Is event ko ek ya ek se zyada category se jodein (e.g., Workshop, Hackathon).'
    },
    { 
      name: 'eventDate', 
      title: 'Event Date & Time', 
      type: 'datetime', 
      validation: (Rule) => Rule.required() 
    },
    {
      name: 'registrationStatus',
      title: 'Registration Status',
      type: 'string',
      options: {
        list: [
          { title: 'Open', value: 'open' },
          { title: 'Closed', value: 'closed' },
          { title: 'Coming Soon', value: 'comingSoon' },
        ],
        layout: 'radio',
      },
      description: 'Select the current registration status for this event.',
      initialValue: 'comingSoon',
      // Yeh field sirf tabhi dikhega jab event ki date future mein ho
      hidden: ({document}) => {
        if (!document?.eventDate) return true;
        return new Date(document.eventDate) < new Date();
      }
    },
    {
      name: 'description', 
      title: 'Description', 
      type: 'array',
      of: [{ type: 'block' }],
    },
    { 
      name: 'coverImage', 
      title: 'Cover Image', 
      type: 'image', 
      options: { hotspot: true } 
    },
    {
      name: 'venue', 
      title: 'Venue', 
      type: 'object',
      fields: [
        { name: 'type', title: 'Event Type', type: 'string', options: { list: ['Online', 'Offline'] } },
        { name: 'locationName', title: 'Location Name', type: 'string' },
        { name: 'locationUrl', title: 'Location URL (Maps/Meeting Link)', type: 'url' }
      ]
    },
    { 
      name: 'registrationLink', 
      title: 'Registration Link (External)', 
      type: 'url' 
    },
    {
      name: 'speakers', 
      title: 'Speakers', 
      type: 'array',
      of: [{ type: 'reference', to: { type: 'person' } }],
    },
    {
      name: 'gallery', 
      title: 'Photo Gallery', 
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
  ],
};