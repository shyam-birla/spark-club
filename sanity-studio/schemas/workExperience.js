// schemas/workExperience.js
export default {
    name: 'workExperience',
    title: 'Work Experience',
    type: 'object',
    fields: [
        { name: 'company', title: 'Company', type: 'string', validation: Rule => Rule.required() },
        { name: 'title', title: 'Job Title', type: 'string', validation: Rule => Rule.required() },
        { name: 'startDate', title: 'Start Date', type: 'date', options: { dateFormat: 'YYYY-MM' } },
        { name: 'endDate', title: 'End Date', type: 'date', options: { dateFormat: 'YYYY-MM' } },
        { name: 'description', title: 'Description', type: 'text' },
    ],
};