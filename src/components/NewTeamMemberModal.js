
'use client';

import { useState } from 'react';
import Modal from './Modal';
import ImageUpload from './ImageUpload';

export default function NewTeamMemberModal({ isOpen, onClose, onAddMember, memberType }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const handleAddMember = () => {
    if (!name.trim() || !role.trim()) {
      setError('Name and role are required.');
      return;
    }
    onAddMember({ name, role, image });
    setName('');
    setRole('');
    setImage(null);
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Add New {memberType}</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image (Optional)</label>
            <ImageUpload onImageChange={setImage} />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-black px-4 py-2 rounded-md font-semibold text-sm hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddMember}
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-blue-700 transition-colors"
          >
            Add Member
          </button>
        </div>
      </div>
    </Modal>
  );
}
