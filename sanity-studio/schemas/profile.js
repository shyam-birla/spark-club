// schemas/profile.js (Updated with External Projects)
export default {
    name: 'profile',
    title: 'User Profile',
    type: 'document',
    fields: [
        // ... (userEmail, userName, bio, social links, etc. waise hi rahenge)
        { name: 'userEmail', title: 'User Email', type: 'string', validation: Rule => Rule.required().email(), },
        { name: 'userName', title: 'Full Name (for Certificate)', type: 'string' },
        { name: 'tagline', title: 'Tagline', type: 'string' },
        { name: 'bio', title: 'About Me / Bio', type: 'text' },
        { name: 'linkedinUrl', title: 'LinkedIn Profile URL', type: 'url' },
        { name: 'githubUrl', title: 'GitHub Profile URL', type: 'url' },
        { name: 'portfolioUrl', title: 'Personal Portfolio URL', type: 'url' },
        { name: 'education', title: 'Education', type: 'array', of: [{ type: 'education' }] },
        { name: 'workExperience', title: 'Work Experience', type: 'array', of: [{ type: 'workExperience' }] },

        // --- YEH NAYA FIELD ADD HUA HAI ---
        {
            name: 'externalProjects',
            title: 'Personal / External Projects',
            type: 'array',
            of: [{ type: 'externalProject' }],
            description: 'User dwara manually add kiye gaye projects.'
        },
        // --- END OF CHANGE ---
    ],
    preview: {
        select: {
            title: 'userName',
            subtitle: 'userEmail'
        }
    }
};