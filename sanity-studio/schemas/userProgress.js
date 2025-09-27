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
            readOnly: true, // Isko Sanity Studio se edit nahi kar sakte
        },
        {
            name: 'roadmap',
            title: 'Roadmap',
            type: 'reference',
            to: [{type: 'stream'}], // 'stream' schema se link kar rahe hain
            readOnly: true,
        },
        {
            name: 'completedResources',
            title: 'Completed Resources',
            type: 'array',
            of: [{type: 'string'}], // Yahan hum resource ka _key store karenge
        },
    ],
    // Studio mein preview ko behtar banane ke liye
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