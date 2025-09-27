// schemas/resource.js (FINAL - With Multiple File Support)
export default {
  name: 'resource',
  title: 'Resource',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Resource Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'duration',
      title: 'Duration (in minutes)',
      type: 'number',
    },
    {
      name: 'type',
      title: 'Resource Type',
      type: 'string',
      options: {
        list: [
          {title: 'Video (Embed)', value: 'videoEmbed'},
          {title: 'SPARK Article', value: 'article'}, 
          {title: 'Slides / Multiple Files', value: 'multiFile'}, // NAYA OPTION
          {title: 'Single Downloadable File', value: 'file'},
          {title: 'External Article / Link', value: 'link'},
          {title: 'Course / Tool', value: 'externalCourse'},
        ],
        layout: 'radio',
      },
      initialValue: 'link',
      validation: (Rule) => Rule.required(),
    },
    // NAYA FIELD multiple files ke liye
    {
        name: 'files',
        title: 'Files',
        type: 'array',
        of: [{type: 'fileWithTitle'}],
        hidden: ({parent}) => parent?.type !== 'multiFile',
    },
    {
      name: 'articleBody',
      title: 'Article Content',
      type: 'blockContent',
      hidden: ({parent}) => parent?.type !== 'article',
    },
    {
      name: 'videoUrl',
      title: 'YouTube / Vimeo URL',
      type: 'url',
      hidden: ({parent}) => parent?.type !== 'videoEmbed',
    },
    {
      name: 'fileUpload',
      title: 'Upload Single File', // Title change kar diya
      type: 'file',
      hidden: ({parent}) => parent?.type !== 'file',
    },
    {
      name: 'link',
      title: 'URL',
      type: 'url',
      hidden: ({parent}) => parent?.type !== 'link' && parent?.type !== 'externalCourse',
    },
  ],
  // Preview logic wahi rahega
};