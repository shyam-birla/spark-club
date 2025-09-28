// schemas/userProgress.js
export default {
    name: 'userProgress',
    title: 'User Progress',
    type: 'document',
    fields: [
        {
            name: 'userEmail',
            title: 'User Email',
            type: 'string',
            readOnly: true,
        },
        {
            name: 'roadmap',
            title: 'Roadmap',
            type: 'reference',
            to: [{type: 'stream'}],
            readOnly: true,
        },
        {
            name: 'completedResources',
            title: 'Completed Resources',
            type: 'array',
            of: [{type: 'string'}],
        },
        // --- YEH NAYA FIELD ADD KAREIN ---
        {
            name: 'lastUpdated',
            title: 'Last Updated',
            type: 'datetime',
        },
        // --- END OF CHANGE ---
    ],
    preview: {
        select: {
            email: 'userEmail',
            roadmapTitle: 'roadmap.title',
            count: 'completedResources.length'
        },
        prepare({email, roadmapTitle, count}) {
            return {
                title: `${email} on "${roadmapTitle}"`,
                subtitle: `${count || 0} resource(s) completed`
            }
        }
    }
}