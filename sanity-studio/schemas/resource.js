// sanity-studio/schemas/resource.js
export default {
  name: 'resource',
  title: 'Resource Link', // Naam badal diya
  type: 'object',
  fields: [
    { name: 'title', title: 'Resource Title', type: 'string' },
    { name: 'link', title: 'URL', type: 'url' },
    {
      name: 'type',
      title: 'Resource Type',
      type: 'string',
      options: {
        list: [ // Dropdown list
          {title: 'Video', value: 'video'},
          {title: 'Article', value: 'article'},
          {title: 'Course', value: 'course'},
          {title: 'Tool', value: 'tool'},
        ],
        layout: 'radio',
      },
    },
  ],
}