// sanity-studio/schemas/certificateTemplate.js

const certificateTemplate = {
  name: 'certificateTemplate',
  title: 'Certificate Template',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Template Name',
      type: 'string',
      description: 'A descriptive name for this template (e.g., "Event Participation Template").',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'htmlContent',
      title: 'HTML Content',
      type: 'text',
      description: 'The HTML structure of the certificate. Use placeholders like {{userName}}, {{eventName}}, {{issueDate}}, {{qrCodeImage}}.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'cssContent',
      title: 'CSS Content',
      type: 'text',
      description: 'The CSS styling for the certificate HTML.',
    },
    {
      name: 'previewImage',
      title: 'Preview Image',
      type: 'image',
      description: 'An optional image to preview the template design.',
      options: { hotspot: true },
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'previewImage',
    },
  },
};

export default certificateTemplate;
