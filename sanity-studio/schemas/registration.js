// Ismein hum registration form ka saara data store karenge.
export default {
  name: 'registration',
  title: 'Registrations',
  type: 'document',
  // Isse Studio mein data a-sāni se dikhega, badla nahi ja sakega.
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
    // BEST PRACTICE: Event ka title save karne ki jagah,
    // hum event ko direct reference karenge. Isse data connected rehta hai.
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
  // Studio mein list ko behtar dikhane ke liye
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