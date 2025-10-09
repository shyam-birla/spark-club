// sanity-studio/schemas/technology.js
const technology = {
  name: 'technology',
  title: 'Technology',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
    },
    // --- YAHAN NAYA FIELD ADD KIYA GAYA HAI ---
    {
      name: 'showOnHomepage',
      title: 'Show on Homepage',
      type: 'boolean',
      description: 'Enable this to feature the technology on the homepage.',
      // initialValue ensures new technologies are shown by default
      initialValue: true, 
    },
  ],
};

export default technology;
