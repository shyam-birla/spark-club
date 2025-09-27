// schemas/fileWithTitle.js
export default {
    name: 'fileWithTitle',
    title: 'File with Title',
    type: 'object',
    fields: [
        {
            name: 'title',
            title: 'File Title',
            type: 'string',
            description: 'E.g., "Lecture 1 Slides" ya "Appendix A"',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'fileUpload',
            title: 'Upload File',
            type: 'file',
            validation: (Rule) => Rule.required(),
        },
    ],
}