
import Link from 'next/link';

export default function SettingsLayout({ children }) {
  const settingsNav = [
    { name: 'Edit Profile', href: '/profile/edit' },
    { name: 'Notifications', href: '/settings/notifications' },
    { name: 'My Content', href: '/settings/my-content' },
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="flex flex-col md:flex-row gap-12">
        <aside className="md:w-1/4">
          <h2 className="text-2xl font-bold mb-6">Settings</h2>
          <nav className="flex flex-col space-y-2">
            {settingsNav.map((item) => (
              <Link key={item.name} href={item.href} className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="md:w-3/4">{children}</main>
      </div>
    </div>
  );
}
