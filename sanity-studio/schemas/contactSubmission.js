// sanity-studio/schemas/contactSubmission.js
export default {
  name: 'contactSubmission',
  title: 'Contact Submissions',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'subject',
      title: 'Subject',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'message',
      title: 'Message',
      type: 'text',
      readOnly: true,
    },
    {
      name: 'read',
      title: 'Mark as Read',
      type: 'boolean',
      initialValue: false,
    },
  ],
  orderings: [
    {
      title: 'Newest First',
      name: 'createdAtDesc',
      by: [{field: '_createdAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'subject',
      read: 'read',
    },
    prepare({title, subtitle, read}) {
      return {
        title: `${read ? '✅' : '📩'} ${title}`,
        subtitle: subtitle,
      }
    }
  }
}