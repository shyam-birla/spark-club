const emailVerification = {
  name: 'emailVerification',
  title: 'Email Verifications',
  type: 'document',
  fields: [
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email(),
    },
    {
      name: 'event',
      title: 'Event',
      type: 'reference',
      to: [{ type: 'event' }],
      validation: Rule => Rule.required(),
    },
    {
      name: 'token',
      title: 'Verification Token',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'expiresAt',
      title: 'Expires At',
      type: 'datetime',
      validation: Rule => Rule.required(),
    },
    {
      name: 'isVerified',
      title: 'Is Verified',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15,
        calendarTodayLabel: 'Today',
      },
      readOnly: true,
    },
  ],
  preview: {
    select: {
      email: 'email',
      eventTitle: 'event.title',
      isVerified: 'isVerified',
      expiresAt: 'expiresAt',
    },
    prepare({ email, eventTitle, isVerified, expiresAt }) {
      const subtitle = `${eventTitle || 'No Event'} | Expires: ${new Date(expiresAt).toLocaleString()}`;
      return {
        title: `${isVerified ? '✅' : '📧'} ${email}`,
        subtitle: subtitle,
      };
    },
  },
};

export default emailVerification;
