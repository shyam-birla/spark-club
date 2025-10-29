// sanity-studio/schemas/blogSubmission.js

const blogSubmission = {
  name: 'blogSubmission',
  title: 'Blog Submission',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
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
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Technical', value: 'technical' },
          { title: 'Community Update', value: 'community-update' },
          { title: 'Tutorial', value: 'tutorial' },
          { title: 'News', value: 'news' },
          { title: 'Event', value: 'event' },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'profile'}, {type: 'person'}],
      validation: (Rule) => Rule.required(),
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
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'approvalStatus',
      title: 'Approval Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending Approval', value: 'pending_approval' },
          { title: 'Approved', value: 'approved' },
          { title: 'Rejected', value: 'rejected' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending_approval',
    },
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'coverImage',
    },
    prepare(selection) {
      const {author} = selection;
      return {...selection, subtitle: author && `by ${author}`};
    },
  },
};

export default blogSubmission;