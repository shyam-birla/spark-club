// sanity-studio/schemas/socialLink.js
export default {
  name: 'socialLink',
  title: 'Social Media Link',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'e.g., GitHub, LinkedIn, Twitter',
    },
    {
      name: 'url',
      title: 'URL',
      type: 'url',
    },
    {
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'e.g., github, linkedin, twitter. Use lowercase.',
    },
  ],
};