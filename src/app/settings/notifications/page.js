'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { client } from '../../../../sanity/lib/client';

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prefs, setPrefs] = useState({
    wantsEventNotifications: true,
    wantsNewsletter: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      const userEmail = session.user.email;
      const query = `*[_type == "profile" && userEmail == $email][0]{
        wantsEventNotifications,
        wantsNewsletter
      }`;

      client.fetch(query, { email: userEmail }).then(data => {
        if (data) {
          setPrefs({
            wantsEventNotifications: data.wantsEventNotifications !== false,
            wantsNewsletter: data.wantsNewsletter !== false,
          });
        }
        setLoading(false);
      });
    }
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, session, router]);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setPrefs(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/settings/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      alert('Preferences updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Notification Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="wantsEventNotifications"
            id="wantsEventNotifications"
            checked={prefs.wantsEventNotifications}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="wantsEventNotifications" className="ml-2 block text-sm text-gray-900">Receive notifications for new events.</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="wantsNewsletter"
            id="wantsNewsletter"
            checked={prefs.wantsNewsletter}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="wantsNewsletter" className="ml-2 block text-sm text-gray-900">Subscribe to the weekly newsletter.</label>
        </div>
        <div className="text-right">
          <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
