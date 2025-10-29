
'use client';

import { useState } from 'react';
import NewTeamMemberModal from './NewTeamMemberModal';

export default function TeamSection({ formData, dispatch, errors, handleLookupProfile, addTeamMember, removeTeamMember, handleTeamMemberChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberType, setMemberType] = useState('');

  const openModal = (type) => {
    setMemberType(type);
    setIsModalOpen(true);
  };

  const handleAddMember = (newMember) => {
    addTeamMember(newMember, memberType);
  };

  return (
    <div className="space-y-6">
      {/* Authors Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Authors</h3>
        {formData.authors.map((author, index) => (
          <div key={index} className="mt-4 p-4 border border-gray-200 rounded-md">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input 
                  type="text" 
                  value={author.name}
                  onChange={(e) => handleTeamMemberChange('authors', index, 'name', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="Enter name or search profile"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input 
                  type="text" 
                  value={author.role}
                  onChange={(e) => handleTeamMemberChange('authors', index, 'role', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="sm:col-span-1 flex items-end">
                <button type="button" onClick={() => removeTeamMember('authors', index)} className="bg-red-600 text-white px-3 py-2 rounded-md">Remove</button>
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => openModal('authors')} className="mt-4 bg-gray-200 text-black px-4 py-2 rounded-md font-semibold text-sm hover:bg-gray-300 transition-colors">Add Author</button>
      </div>

      {/* Mentors Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Mentors</h3>
        {formData.mentors.map((mentor, index) => (
          <div key={index} className="mt-4 p-4 border border-gray-200 rounded-md">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input 
                  type="text" 
                  value={mentor.name}
                  onChange={(e) => handleTeamMemberChange('mentors', index, 'name', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="Enter name or search profile"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input 
                  type="text" 
                  value={mentor.role}
                  onChange={(e) => handleTeamMemberChange('mentors', index, 'role', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="sm:col-span-1 flex items-end">
                <button type="button" onClick={() => removeTeamMember('mentors', index)} className="bg-red-600 text-white px-3 py-2 rounded-md">Remove</button>
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => openModal('mentors')} className="mt-4 bg-gray-200 text-black px-4 py-2 rounded-md font-semibold text-sm hover:bg-gray-300 transition-colors">Add Mentor</button>
      </div>
      {errors.team && <p className="text-red-500 text-xs mt-1">{errors.team}</p>}

      <NewTeamMemberModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddMember={handleAddMember} 
        memberType={memberType} 
      />
    </div>
  );
}
