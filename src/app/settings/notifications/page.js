'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { client } from '../../../../sanity/lib/client';
import { toast } from 'react-hot-toast';
import { FaBell, FaEnvelope, FaCalendarAlt, FaNewspaper, FaSpinner, FaCheckCircle } from 'react-icons/fa';

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prefs, setPrefs] = useState({
    wantsEventNotifications: true,
    wantsNewsletter: true,
    // New placeholder notification types
    wantsProjectUpdates: true,
    wantsBlogComments: false,
    notificationFrequency: 'instant', // 'instant', 'daily', 'weekly'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      const userEmail = session.user.email;
      // TODO: Update Sanity profile schema to include new notification preferences
      const query = `*[_type == "profile" && userEmail == $email][0]{
        wantsEventNotifications,
        wantsNewsletter,
        wantsProjectUpdates,
        wantsBlogComments,
        notificationFrequency
      }`;

      client.fetch(query, { email: userEmail }).then(data => {
        if (data) {
          setPrefs({
            wantsEventNotifications: data.wantsEventNotifications !== false,
            wantsNewsletter: data.wantsNewsletter !== false,
            wantsProjectUpdates: data.wantsProjectUpdates !== false,
            wantsBlogComments: data.wantsBlogComments === true,
            notificationFrequency: data.notificationFrequency || 'instant',
          });
        }
        setLoading(false);
      }).catch(error => {
        console.error('Error fetching notification preferences:', error);
        toast.error('Failed to load notification preferences.');
        setLoading(false);
      });
    }
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, session, router]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setPrefs(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // TODO: Update /api/settings/notifications to handle new preferences
      const response = await fetch('/api/settings/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      toast.success('Notification preferences updated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
        <p className="ml-4 text-lg text-gray-700">Loading notification preferences...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
        <FaBell className="text-blue-500" /> Notification Settings
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4 border-b pb-6">
          <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2"><FaEnvelope /> Email Notifications</h3>
          <div className="flex items-center justify-between">
            <label htmlFor="wantsEventNotifications" className="text-sm font-medium text-gray-700">New Event Announcements</label>
            <input
              type="checkbox"
              name="wantsEventNotifications"
              id="wantsEventNotifications"
              checked={prefs.wantsEventNotifications}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="wantsNewsletter" className="text-sm font-medium text-gray-700">Weekly Newsletter</label>
            <input
              type="checkbox"
              name="wantsNewsletter"
              id="wantsNewsletter"
              checked={prefs.wantsNewsletter}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          {/* Placeholder for new email notification types */}
          <div className="flex items-center justify-between">
            <label htmlFor="wantsProjectUpdates" className="text-sm font-medium text-gray-700">Project Updates</label>
            <input
              type="checkbox"
              name="wantsProjectUpdates"
              id="wantsProjectUpdates"
              checked={prefs.wantsProjectUpdates}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="wantsBlogComments" className="text-sm font-medium text-gray-700">New Blog Comments</label>
            <input
              type="checkbox"
              name="wantsBlogComments"
              id="wantsBlogComments"
              checked={prefs.wantsBlogComments}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2"><FaCalendarAlt /> Notification Frequency</h3>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <label htmlFor="notificationFrequency" className="text-sm font-medium text-gray-700">How often should we send notifications?</label>
            <select
              name="notificationFrequency"
              id="notificationFrequency"
              value={prefs.notificationFrequency}
              onChange={handleChange}
              className="mt-1 block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="instant">Instant</option>
              <option value="daily">Daily Digest</option>
              <option value="weekly">Weekly Summary</option>
            </select>
          </div>
        </div>

        <div className="text-right pt-6 border-t">
          <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2 ml-auto">
            {saving ? <><FaSpinner className="animate-spin" /> Saving...</> : <><FaCheckCircle /> Save Preferences</>}
          </button>
        </div>
      </form>
    </div>
  );
}
