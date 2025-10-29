'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { FaShieldAlt, FaCookieBite, FaFileContract, FaCheckCircle } from 'react-icons/fa';

export default function PrivacySettingsPage() {
  const [dataCollection, setDataCollection] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: true,
    marketing: false,
  });

  const handleSavePreferences = (e) => {
    e.preventDefault();
    // TODO: Implement API call to save privacy preferences
    toast.success('Privacy preferences saved functionality is not yet implemented.');
    console.log('Privacy Preferences Saved:', { dataCollection, marketingEmails, cookiePreferences });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
          <FaShieldAlt className="text-green-500" /> Data & Privacy
        </h2>
        <form onSubmit={handleSavePreferences} className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="dataCollection" className="block text-sm font-medium text-gray-700">Allow Data Collection</label>
            <input
              type="checkbox"
              id="dataCollection"
              checked={dataCollection}
              onChange={(e) => setDataCollection(e.target.checked)}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="marketingEmails" className="block text-sm font-medium text-gray-700">Receive Marketing Emails</label>
            <input
              type="checkbox"
              id="marketingEmails"
              checked={marketingEmails}
              onChange={(e) => setMarketingEmails(e.target.checked)}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FaCheckCircle /> Save Preferences
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
          <FaCookieBite className="text-yellow-600" /> Cookie Preferences
        </h2>
        <form onSubmit={handleSavePreferences} className="space-y-4">
          <p className="text-gray-600">Manage your cookie settings. You can enable or disable different types of cookies below.</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="necessaryCookies" className="block text-sm font-medium text-gray-700">Necessary Cookies</label>
              <input type="checkbox" id="necessaryCookies" checked={cookiePreferences.necessary} disabled className="h-5 w-5 text-gray-400 border-gray-300 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="analyticsCookies" className="block text-sm font-medium text-gray-700">Analytics Cookies</label>
              <input
                type="checkbox"
                id="analyticsCookies"
                checked={cookiePreferences.analytics}
                onChange={(e) => setCookiePreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="marketingCookies" className="block text-sm font-medium text-gray-700">Marketing Cookies</label>
              <input
                type="checkbox"
                id="marketingCookies"
                checked={cookiePreferences.marketing}
                onChange={(e) => setCookiePreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FaCheckCircle /> Save Cookie Preferences
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
          <FaFileContract className="text-purple-500" /> Privacy Policy
        </h2>
        <p className="text-gray-600 mb-4">For more details on how we handle your data, please refer to our full Privacy Policy.</p>
        <Link href="/privacy-policy" className="text-blue-600 hover:underline font-medium">View Privacy Policy</Link>
      </div>
    </div>
  );
}
