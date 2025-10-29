// src/components/ProjectLinksSection.js
"use client";

import React from 'react';
import { IoMdCheckmark } from 'react-icons/io';

const ProjectLinksSection = ({ formData, dispatch, errors, validatedFields }) => {
  return (
    <section id="links" className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Links</h2>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 flex items-center">
            GitHub URL
            {validatedFields.githubUrl && <IoMdCheckmark className="ml-2 text-green-500" />}
          </label>
          <input
            type="url"
            name="githubUrl"
            id="githubUrl"
            value={formData.githubUrl}
            onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'githubUrl', value: e.target.value })}
            className={`mt-1 block w-full px-3 py-2 border ${errors.githubUrl ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.githubUrl && <p className="mt-2 text-sm text-red-600">{errors.githubUrl}</p>}
        </div>
        <div>
          <label htmlFor="liveUrl" className="block text-sm font-medium text-gray-700 flex items-center">
            Live URL
            {validatedFields.liveUrl && <IoMdCheckmark className="ml-2 text-green-500" />}
          </label>
          <input
            type="url"
            name="liveUrl"
            id="liveUrl"
            value={formData.liveUrl}
            onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'liveUrl', value: e.target.value })}
            className={`mt-1 block w-full px-3 py-2 border ${errors.liveUrl ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.liveUrl && <p className="mt-2 text-sm text-red-600">{errors.liveUrl}</p>}
        </div>
      </div>
    </section>
  );
};

export default ProjectLinksSection;
