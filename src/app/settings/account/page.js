'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaLock, FaTrash, FaSpinner, FaKey, FaExclamationTriangle } from 'react-icons/fa';

export default function AccountSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  // TODO: Determine if the user has a local password set.
  // This could be based on:
  // 1. A field in the user's profile in Sanity (e.g., `authProvider: 'credentials'`).
  // 2. Information from the next-auth session (e.g., `session.user.provider` if available and indicates 'credentials').
  // For now, we'll assume `true` for demonstration, but this should be dynamic.
  const hasPassword = true; // This should be dynamically determined based on user's auth method

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }
    // TODO: Implement API call to change password
    toast.success('Password change functionality is not yet implemented.');
    console.log('Change Password Submitted:', { currentPassword, newPassword });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setIsDeletingAccount(true);
      // TODO: Implement API call to delete account
      toast.success('Account deletion functionality is not yet implemented.');
      console.log('Account Deletion Confirmed.');
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="space-y-8">
      {hasPassword && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <FaLock className="text-blue-500" /> Change Password
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaKey className="text-gray-400" />
              </div>
              <label htmlFor="currentPassword" className="sr-only">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Current Password"
                required
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaKey className="text-gray-400" />
              </div>
              <label htmlFor="newPassword" className="sr-only">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="New Password"
                required
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaKey className="text-gray-400" />
              </div>
              <label htmlFor="confirmNewPassword" className="sr-only">Confirm New Password</label>
              <input
                type="password"
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm New Password"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FaLock /> Change Password
            </button>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md border border-red-300">
        <h2 className="text-xl font-semibold mb-4 text-red-700 flex items-center gap-2">
          <FaExclamationTriangle className="text-red-500" /> Delete Account
        </h2>
        <p className="text-gray-600 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
        <button
          type="button"
          onClick={handleDeleteAccount}
          disabled={isDeletingAccount}
          className="bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-red-400 flex items-center gap-2"
        >
          {isDeletingAccount ? <><FaSpinner className="animate-spin" /> Deleting...</> : <><FaTrash /> Delete Account</>}
        </button>
      </div>
    </div>
  );
}
