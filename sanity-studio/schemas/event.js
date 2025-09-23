// sanity-studio/schemas/event.js
export default {
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    { name: 'title', title: 'Event Title', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (Rule) => Rule.required() },
    { name: 'eventDate', title: 'Event Date & Time', type: 'datetime', validation: (Rule) => Rule.required() },
    {
      name: 'description', title: 'Description', type: 'array',
      of: [{ type: 'block' }], // Rich Text
    },
    { name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } },
    {
      name: 'status', title: 'Status', type: 'string',
      options: { list: ['upcoming', 'past'], layout: 'radio' },
    },
    {
      name: 'venue', title: 'Venue', type: 'object',
      fields: [
        { name: 'type', title: 'Event Type', type: 'string', options: { list: ['Online', 'Offline'] } },
        { name: 'locationName', title: 'Location Name', type: 'string' },
        { name: 'locationUrl', title: 'Location URL (Maps/Meeting Link)', type: 'url' }
      ]
    },
    { name: 'registrationLink', title: 'Registration Link (External)', type: 'url' },
    {
      name: 'speakers', title: 'Speakers', type: 'array',
      of: [{ type: 'reference', to: { type: 'person' } }],
    },
    {
      name: 'gallery', title: 'Photo Gallery', type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
  ],
};