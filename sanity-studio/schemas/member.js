export default {
  name: 'member',
  title: 'Member',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    // === NAYA FIELD ADD KIYA GAYA HAI (MEMBER SORTING KE LIYE) ===
    {
      name: 'orderRank',
      title: 'Order Rank (within team)',
      type: 'number',
      description: 'Team ke andar member kis order mein dikhega. Chota number pehle (President ko 1, VP ko 2).',
      validation: (Rule) => Rule.required().integer().positive(),
    },
    // === NAYA FIELD ADD KIYA GAYA HAI (TEAM ASSIGN KARNE KE LIYE) ===
    {
      name: 'team',
      title: 'Team',
      type: 'reference',
      to: [{ type: 'team' }], // Yeh 'team' schema se link karega
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'role',
      title: 'Role / Position',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    },
    {
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    },
    {
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    },
    {
      name: 'bio',
      title: 'Biography',
      type: 'blockContent',
    },
  ],
};