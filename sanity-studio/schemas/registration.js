// sanity-studio/schemas/registration.js
const registration = {
  name: 'registration',
  title: 'Registrations',
  type: 'document',
  readOnly: true, 
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    // === YAHAN BADLAV KIYA GAYA HAI ===
    {
      name: 'mobileNo',
      title: 'Mobile Number',
      type: 'string',
    },
    {
      name: 'collegeName', // "College/Institute/Organization Name" ke liye
      title: 'College Name',
      type: 'string',
    },
    // === END OF CHANGE ===
    {
      name: 'userProfile',
      title: 'User Profile',
      description: 'The user\'s main profile, if they were logged in.',
      type: 'reference',
      to: [{ type: 'profile' }],
    },
    {
      name: 'event',
      title: 'Event',
      type: 'reference',
      to: [{ type: 'event' }],
    },
    {
      name: 'customData',
      title: 'Custom Registration Data',
      type: 'object',
      fields: [
        {
          name: 'fields',
          title: 'Fields',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'key', title: 'Field Name', type: 'string' },
                { name: 'value', title: 'Field Value', type: 'string' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'registrationDate',
      title: 'Registration Date',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      name: 'name',
      email: 'email',
      event: 'event.title',
    },
    prepare({ name, email, event }) {
      return {
        title: name,
        subtitle: `Registered for ${event} (${email})`,
      };
    },
  },
};

export default registration;