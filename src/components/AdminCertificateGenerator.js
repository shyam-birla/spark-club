"use client";

import React, { useState, useEffect } from 'react';
import { client } from '../../sanity/lib/client'; // Adjust path as necessary

const AdminCertificateGenerator = () => {
  const [events, setEvents] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [users, setUsers] = useState([]); // To fetch users for selection
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedEvents, fetchedTemplates, fetchedUsers] = await Promise.all([
          client.fetch(`*[_type == "event"]{_id, title}`),
          client.fetch(`*[_type == "certificateTemplate"]{_id, name}`),
          client.fetch(`*[_type == "profile"]{_id, userName, email}`), // Fetch user profiles
        ]);
        setEvents(fetchedEvents);
        setTemplates(fetchedTemplates);
        setUsers(fetchedUsers);
      } catch (err) {
        setError('Failed to fetch data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (!selectedEvent || selectedUser.length === 0 || !selectedTemplate) {
      setError('Please select an event, at least one user, and a template.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/generate-certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: selectedEvent,
          userIds: selectedUser, // Send an array of user IDs
          templateId: selectedTemplate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message + (data.certificates && data.certificates.length > 0 ? ` Details: ${data.certificates.map(c => `${c.userName} (${c.certificateUrl ? 'URL' : 'No URL'})`).join(', ')}` : ''));
      } else {
        setError(data.message || 'Failed to generate certificate.');
      }
    } catch (err) {
      setError('An unexpected error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && events.length === 0 && templates.length === 0 && users.length === 0) {
    return <div className="text-center py-8">Loading data...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Generate Certificate (Admin)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="event-select" className="block text-sm font-medium text-gray-700">Select Event:</label>
          <select
            id="event-select"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">-- Select an Event --</option>
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="user-select" className="block text-sm font-medium text-gray-700">Select User:</label>
          <select
            id="user-select"
            value={selectedUser}
            onChange={(e) => {
              const options = Array.from(e.target.options);
              const values = options.filter(option => option.selected).map(option => option.value);
              setSelectedUser(values);
            }}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            multiple // Allow multiple selections
            size="5" // Show more options at once
          >
            <option value="">-- Select a User --</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.userName} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="template-select" className="block text-sm font-medium text-gray-700">Select Template:</label>
          <select
            id="template-select"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">-- Select a Template --</option>
            {templates.map((template) => (
              <option key={template._id} value={template._id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Certificate'}
        </button>
      </form>

      {message && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
          {message}
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default AdminCertificateGenerator;
