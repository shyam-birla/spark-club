// sanity-studio/schemas/eventFeedback.js

const eventFeedback = {
  name: 'eventFeedback',
  title: 'Event Feedback',
  type: 'document',
  fields: [
    {
      name: 'event',
      title: 'Event',
      type: 'reference',
      to: [{ type: 'event' }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'userProfile',
      title: 'User Profile',
      type: 'reference',
      to: [{ type: 'profile' }],
      description: 'The user who submitted the feedback.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      options: {
        list: [
          { title: '1 Star', value: 1 },
          { title: '2 Stars', value: 2 },
          { title: '3 Stars', value: 3 },
          { title: '4 Stars', value: 4 },
          { title: '5 Stars', value: 5 },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required().min(1).max(5),
    },
    {
      name: 'comment',
      title: 'Comment',
      type: 'text',
      description: 'Optional feedback comment.',
    },
    {
      name: 'submissionDate',
      title: 'Submission Date',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        calendarTodayLabel: 'Today',
      },
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    },
  ],
  preview: {
    select: {
      title: 'event.title',
      subtitle: 'userProfile.userName',
      rating: 'rating',
    },
    prepare(selection) {
      const { title, subtitle, rating } = selection;
      return {
        title: `${title} (${rating} Stars)`,
        subtitle: `By ${subtitle || 'Anonymous'}`,
      };
    },
  },
};

export default eventFeedback;
