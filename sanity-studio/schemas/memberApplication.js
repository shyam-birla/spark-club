// sanity-studio/schemas/memberApplication.js
export default {
  name: 'memberApplication',
  title: 'Member Applications',
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
      name: 'year',
      title: 'Year',
      type: 'string',
    },
    {
      name: 'branch',
      title: 'Branch',
      type: 'string',
    },
    {
      name: 'interests',
      title: 'Interests',
      type: 'text',
    },
    {
      name: 'applicationDate',
      title: 'Application Date',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      name: 'name',
      email: 'email',
      applicationDate: 'applicationDate',
    },
    prepare({ name, email, applicationDate }) {
      return {
        title: name,
        subtitle: `${email} (Applied on ${new Date(applicationDate).toLocaleDateString()})`,
      };
    },
  },
};
