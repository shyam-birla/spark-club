export default {
  name: 'team',
  title: 'Team',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Team ka naam (jaise "Core Team", "Tech Team")',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'orderRank',
      title: 'Order Rank',
      type: 'number',
      description: 'Team kis order mein dikhegi. Chota number pehle aayega (jaise Core Team ko 1, Tech Team ko 2).',
      validation: (Rule) => Rule.required().integer().positive(),
    },
  ],
  // Teams ko unke order rank ke hisaab se Sanity Studio mein sort karke dikhane ke liye
  orderings: [
    {
      title: 'Manual Order',
      name: 'manualOrder',
      by: [{ field: 'orderRank', direction: 'asc' }],
    },
  ],
};