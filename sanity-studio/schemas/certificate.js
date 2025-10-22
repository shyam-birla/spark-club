// sanity-studio/schemas/certificate.js

const certificate = {
  name: 'certificate',
  title: 'Certificate',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Certificate Title',
      type: 'string',
      description: 'e.g., "Event Participation Certificate", "Roadmap Completion Certificate"',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'uniqueId',
      title: 'Unique ID',
      type: 'string',
      description: 'A unique identifier for this certificate (e.g., UUID). Used for verification.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'issueDate',
      title: 'Issue Date',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        calendarTodayLabel: 'Today',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'event',
      title: 'Related Event',
      type: 'reference',
      to: [{ type: 'event' }],
      description: 'The event for which this certificate was issued (if applicable).',
    },

    {
      name: 'userProfile',
      title: 'Recipient User Profile',
      type: 'reference',
      to: [{ type: 'profile' }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'certificateFile',
      title: 'Certificate File',
      type: 'file',
      description: 'The generated certificate file (e.g., PDF).',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'verificationUrl',
      title: 'Verification URL',
      type: 'url',
      description: 'The URL where this certificate can be verified. Encoded in the QR code.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'certificateTemplate',
      title: 'Certificate Template',
      type: 'reference',
      to: [{ type: 'certificateTemplate' }],
      description: 'The template used to generate this certificate.',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'userProfile.userName',
      media: 'certificateFile',
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title,
        subtitle: `Issued to ${subtitle || 'Unknown User'}`,
      };
    },
  },
};

export default certificate;
