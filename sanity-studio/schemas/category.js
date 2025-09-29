// schemas/category.js (Updated with Display Order)
export default {
    name: 'category',
    title: 'Category',
    type: 'document',
    // Naya order field add kiya
    orderings: [
        {
            title: 'Display Order',
            name: 'displayOrderAsc',
            by: [{field: 'displayOrder', direction: 'asc'}]
        }
    ],
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: Rule => Rule.required(),
        },
        // --- YEH NAYA FIELD ADD HUA HAI ---
        {
            name: 'displayOrder',
            title: 'Display Order',
            type: 'number',
            description: 'A smaller number (like 1, 2) will appear higher up on the page. Jo categories upar dikhani hain, unka number chhota rakhein.',
            initialValue: 99,
        },
        // --- END OF CHANGE ---
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: Rule => Rule.required(),
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
        },
    ],
};