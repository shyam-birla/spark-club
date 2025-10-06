// sanity-studio/schemas/registration.js
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