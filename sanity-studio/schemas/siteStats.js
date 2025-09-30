// sanity-studio/schemas/siteStats.js
export default {
    name: 'siteStats',
    title: 'Site Stats',
    type: 'document',
    fields: [
        {
            name: 'membersCount',
            title: 'Active Members Count',
            type: 'number',
        },
        {
            name: 'projectsCount',
            title: 'Projects Completed Count',
            type: 'number',
        },
        {
            name: 'eventsCount',
            title: 'Events Hosted Count',
            type: 'number',
        },
    ],
}