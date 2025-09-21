// sanity-studio/schemas/aboutPage.js
export default {
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'The main heading on the about page.',
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'content',
      title: 'Content',
      type: 'blockContent', // Reusing the rich text editor from the blog
      description: 'The main body of text for the about page.',
    },
  ],
}