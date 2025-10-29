'use client';

import { FaInfoCircle } from 'react-icons/fa';

export default function SettingsPage() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
        <FaInfoCircle className="text-blue-500" /> General Settings
      </h2>
      <p className="text-gray-600 leading-relaxed">
        Welcome to your personalized settings dashboard. Here you can manage various aspects of your account and preferences.
        Use the navigation menu on the left to explore and update specific settings categories.
      </p>
    </div>
  );
}
