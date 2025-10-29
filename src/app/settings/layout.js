'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { FaUserCircle, FaFileAlt, FaBell, FaCog, FaShieldAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const settingsNavLinks = [
  { name: 'Profile', href: '/profile/edit', icon: FaUserCircle },
  { name: 'My Content', href: '/settings/my-content', icon: FaFileAlt },
  { name: 'Notifications', href: '/settings/notifications', icon: FaBell },
  { name: 'Account', href: '/settings/account', icon: FaCog }, // Placeholder for future account settings
  { name: 'Privacy', href: '/settings/privacy', icon: FaShieldAlt },   // Placeholder for future privacy settings
];

export default function SettingsLayout({ children }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main className="container mx-auto px-4 py-12 md:py-20">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Settings</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="md:w-1/4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Navigation</h2>
          <ul className="space-y-2">
            {settingsNavLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors',
                    {
                      'bg-blue-500 text-white hover:bg-blue-600': isClient && pathname === link.href,
                    }
                  )}
                >
                  <link.icon className="text-lg" />
                  <span>{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content Area */}
        <div className="md:w-3/4">
          {children}
        </div>
      </div>
    </main>
  );
}