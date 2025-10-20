// schemas/profile.js
const profile = {
    name: 'profile',
    title: 'User Profile',
    type: 'document',
    fields: [
        { 
            name: 'userEmail', 
            title: 'User Email', 
            type: 'string', 
            validation: Rule => Rule.required().email() 
        },
        { 
            name: 'userName', 
            title: 'Full Name (for Certificate)', 
            type: 'string' 
        },

        // --- YEH NAYA FIELD ADD HUA HAI ---
        {
            name: 'userImage',
            title: 'Profile Picture',
            type: 'image',
            description: 'User yahan apni profile picture upload kar sakta hai.',
            options: {
                hotspot: true // Yeh image ko crop karne mein help karta hai
            }
        },
        // --- END OF CHANGE ---

        { name: 'tagline', title: 'Tagline', type: 'string' },
        { name: 'bio', title: 'About Me / Bio', type: 'text' },
        { name: 'linkedinUrl', title: 'LinkedIn Profile URL', type: 'url' },
        { name: 'githubUrl', title: 'GitHub Profile URL', type: 'url' },
        { name: 'portfolioUrl', title: 'Personal Portfolio URL', type: 'url' },
        { name: 'education', title: 'Education', type: 'array', of: [{ type: 'education' }] },
        { name: 'workExperience', title: 'Work Experience', type: 'array', of: [{ type: 'workExperience' }] },
        {
            name: 'externalProjects',
            title: 'Personal / External Projects',
            type: 'array',
            of: [{ type: 'externalProject' }],
            description: 'User dwara manually add kiye gaye projects.'
        },
    ],
    preview: {
        select: {
            title: 'userName',
            subtitle: 'userEmail',
            media: 'userImage' // Preview mein image dikhane ke liye
        }
    }
};

export default profile;