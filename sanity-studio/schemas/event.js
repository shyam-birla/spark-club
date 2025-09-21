// sanity-studio/schemas/event.js

export default {
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Event Title',
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
      name: 'eventDate',
      title: 'Event Date',
      type: 'datetime', // Date aur time dono ke liye
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [ // Dropdown list banayega
          {title: 'Upcoming', value: 'upcoming'},
          {title: 'Past', value: 'past'},
        ],
        layout: 'radio', // Radio buttons ki tarah dikhega
      },
    },
  ],
};