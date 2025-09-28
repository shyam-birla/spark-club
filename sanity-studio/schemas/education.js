// schemas/education.js
export default {
    name: 'education',
    title: 'Education',
    type: 'object',
    fields: [
        { name: 'school', title: 'School / University', type: 'string', validation: Rule => Rule.required() },
        { name: 'degree', title: 'Degree', type: 'string', description: 'E.g., Bachelor of Technology in CSE' },
        { name: 'startDate', title: 'Start Date', type: 'date', options: { dateFormat: 'YYYY-MM' } },
        { name: 'endDate', title: 'End Date', type: 'date', options: { dateFormat: 'YYYY-MM' } },
    ],
};