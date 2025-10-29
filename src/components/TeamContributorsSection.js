// src/components/TeamContributorsSection.js
"use client";

import React from 'react';
import { IoMdCheckmark } from 'react-icons/io';

const getInitials = (name) => {
  if (!name) return '';
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
};

const TeamContributorsSection = ({
  formData,
  dispatch,
  errors,
  validatedFields,
  handleLookupProfile,
  addTeamMember,
  removeTeamMember,
  handleSoloContributorChange,
  handleTeamMemberChange,
}) => {
const [expandedMembers, setExpandedMembers] = React.useState({});

  const toggleMemberDetails = (index) => {
    setExpandedMembers(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <section id="teamContributors" className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        Team & Contributors
        {validatedFields.teamContributors && <IoMdCheckmark className="ml-2 text-green-500" />}
      </h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Project Type</label>
        <div className="mt-2 flex gap-4">
          <label><input type="radio" name="projectType" value="team" checked={formData.projectType === 'team'} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'projectType', value: e.target.value })} className="mr-2" />Team Project</label>
          <label><input type="radio" name="projectType" value="solo" checked={formData.projectType === 'solo'} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'projectType', value: e.target.value })} className="mr-2" />Solo Project</label>
        </div>
      </div>

      {formData.projectType === 'solo' ? (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Solo Contributor</h3>
          <div className="flex items-end gap-2">
            <input
              type="text"
              placeholder="Contributor Profile ID"
              value={formData.soloContributor.uniqueProfileId || ''}
              onChange={(e) => handleSoloContributorChange('uniqueProfileId', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            <button type="button" onClick={() => handleLookupProfile(formData.soloContributor.uniqueProfileId)} className="bg-blue-500 text-white px-4 py-2 rounded-md">Lookup</button>
          </div>
          {formData.soloContributor.name && (
            <div className="mt-2 p-2 border rounded-md bg-gray-50">
              <div className="flex items-center gap-4">
                {!formData.soloContributor.profileImage ? (
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-600">{getInitials(formData.soloContributor.name)}</span>
                </div>
              ) : (
                <img src={formData.soloContributor.profileImage} alt={formData.soloContributor.name} className="w-16 h-16 rounded-full" />
              )}
                <div>
                  <p><strong>Name:</strong> {formData.soloContributor.name}</p>
                  <p><strong>Email:</strong> {formData.soloContributor.email}</p>
                </div>
              </div>
              <input
                type="text"
                placeholder="Role in Project"
                value={formData.soloContributor.role}
                onChange={(e) => handleSoloContributorChange('role', e.target.value)}
                className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              <div className="mt-2 space-y-2">
                <input type="text" placeholder="LinkedIn URL" value={formData.soloContributor.linkedinUrl || ''} onChange={(e) => handleSoloContributorChange('linkedinUrl', e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                <input type="text" placeholder="GitHub URL" value={formData.soloContributor.githubUrl || ''} onChange={(e) => handleSoloContributorChange('githubUrl', e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                <input type="text" placeholder="Portfolio URL" value={formData.soloContributor.portfolioUrl || ''} onChange={(e) => handleSoloContributorChange('portfolioUrl', e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Team Members</h3>
          {formData.teamMembers.map((member, index) => (
            <div key={index} className="mb-4 p-4 border rounded-md">
              <div className="flex items-end gap-2">
                <input
                  type="text"
                  placeholder="Member Profile ID"
                  value={member.uniqueProfileId || ''}
                  onChange={(e) => handleTeamMemberChange('teamMembers', index, 'uniqueProfileId', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
                <button type="button" onClick={() => handleLookupProfile(member.uniqueProfileId, 'teamMembers', index)} className="bg-blue-500 text-white px-4 py-2 rounded-md">Lookup</button>
                <button type="button" onClick={() => removeTeamMember('teamMembers', index)} className="bg-red-500 text-white px-4 py-2 rounded-md">Remove</button>
              </div>
              {member.name && (
                <div className="mt-2">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleMemberDetails(index)}
                  >
                    <div className="flex items-center gap-4">
                      {!member.profileImage ? (
                      <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-xl font-bold text-gray-600">{getInitials(member.name)}</span>
                      </div>
                    ) : (
                      <img src={member.profileImage} alt={member.name} className="w-16 h-16 rounded-full" />
                    )}
                      <div>
                        <p><strong>Name:</strong> {member.name}</p>
                        <p><strong>Email:</strong> {member.email}</p>
                      </div>
                    </div>
                    <span style={{ transform: expandedMembers[index] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>^</span>
                  </div>
                  {expandedMembers[index] && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Role in Project"
                        value={member.role}
                        onChange={(e) => handleTeamMemberChange('teamMembers', index, 'role', e.target.value)}
                        className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      />
                      <div className="mt-2 space-y-2">
                        <input type="text" placeholder="LinkedIn URL" value={member.linkedinUrl || ''} onChange={(e) => handleTeamMemberChange('teamMembers', index, 'linkedinUrl', e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                        <input type="text" placeholder="GitHub URL" value={member.githubUrl || ''} onChange={(e) => handleTeamMemberChange('teamMembers', index, 'githubUrl', e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                        <input type="text" placeholder="Portfolio URL" value={member.portfolioUrl || ''} onChange={(e) => handleTeamMemberChange('teamMembers', index, 'portfolioUrl', e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                      </div>
                      <label className="mt-2 flex items-center">
                        <input
                          type="checkbox"
                          checked={member.isTeamLead}
                          onChange={(e) => handleTeamMemberChange('teamMembers', index, 'isTeamLead', e.target.checked)}
                          className="mr-2"
                        />
                        Team Lead
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addTeamMember({ uniqueProfileId: '', name: '', role: '', isTeamLead: false }, 'teamMembers')} className="bg-green-500 text-white px-4 py-2 rounded-md">Add Team Member</button>
        </div>
      )}
    </section>
  );
};

export default TeamContributorsSection;