// schemas/externalProject.js
export default {
    name: 'externalProject',
    title: 'External Project',
    type: 'object',
    fields: [
        { 
            name: 'title', 
            title: 'Project Title', 
            type: 'string', 
            validation: Rule => Rule.required() 
        },
        { 
            name: 'description', 
            title: 'Short Description', 
            type: 'text' 
        },
        { 
            name: 'projectUrl', 
            title: 'Project URL (GitHub/Live Demo)', 
            type: 'url',
            validation: Rule => Rule.required() 
        },
        {
            name: 'technologies',
            title: 'Technologies Used',
            type: 'array',
            // Hum apne existing 'technology' schema ko yahan fir se use kar rahe hain!
            of: [{ type: 'reference', to: { type: 'technology' } }],
        }
    ],
};