'use client';

import { useEffect } from 'react';

export default function AddToCalendar({ event, plainDescription }) {
    useEffect(() => {
        import('add-to-calendar-button');
    }, []);

    return (
        <add-to-calendar-button
            name={event.title}
            description={`Join the event, visit the link below : ${event.venue?.locationUrl || ''}`}
            startDate={new Date(event.eventDate).toISOString().split('T')[0]}
            endDate={event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : new Date(event.eventDate).toISOString().split('T')[0]}
            startTime={new Date(event.eventDate).toTimeString().split(' ')[0]}
            endTime={event.endDate ? new Date(event.endDate).toTimeString().split(' ')[0] : "18:00"}
            timeZone="Asia/Kolkata"
            location={event.venue?.locationUrl || event.venue?.locationName || 'Check Details'}
            url=""
            options="'Apple','Google','Outlook.com'"
            buttonStyle="default"
            listStyle="modal"
            reminders="30,10"
        ></add-to-calendar-button>
    );
}
