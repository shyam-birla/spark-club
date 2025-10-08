export default {
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
    // === YAHAN NAYA FIELD ADD KIYA GAYA HAI ===
    {
      name: 'userProfile',
      title: 'User Profile',
      description: 'Agar user logged in tha, toh yeh uski profile se link hoga.',
      type: 'reference',
      to: [{ type: 'profile' }], // Aapke 'profile' schema se link karega
    },
    // === END OF CHANGE ===
    {
      name: 'event',
      title: 'Event',
      type: 'reference',
      to: [{ type: 'event' }],
    },
    {
      name: 'mobile',
      title: 'Mobile Number',
      type: 'string',
    },
    {
      name: 'branch',
      title: 'Branch',
      type: 'string',
    },
    {
      name: 'enrollmentNo',
      title: 'Enrollment Number',
      type: 'string',
    },
    {
      name: 'year',
      title: 'Year',
      type: 'string',
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