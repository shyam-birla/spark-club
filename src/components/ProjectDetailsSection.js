// src/components/ProjectDetailsSection.js
"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { IoMdCheckmark } from 'react-icons/io';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

const ProjectDetailsSection = ({
  formData,
  dispatch,
  errors,
  validatedFields,
  allTechnologies,
  filteredTechnologies,
  technologySearchQuery,
  showAddTechnologyForm,
  newTechnologyName,
  newTechnologyLogoPreview,
  savingNewTechnology,
  showTechnologyList,
  setShowTechnologyList,
  setShowAddTechnologyForm,
  handleTechnologySearch,
  handleNewTechnologyNameChange,
  handleNewTechnologyLogoChange,
  clearNewTechnologyLogo,
  handleAddTechnology,
}) => {
  const [currentTagInput, setCurrentTagInput] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    console.log('ProjectDetailsSection: isClient set to true');
  }, []);

  const handleTagInputChange = (e) => setCurrentTagInput(e.target.value);

  const handleAddTag = (e) => {
    if (e.key === ' ' || e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      const newTag = currentTagInput.trim().toLowerCase();
      if (newTag && !formData.tags.includes(newTag)) {
        dispatch({ type: 'ADD_TAG', tag: newTag });
      }
      setCurrentTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    dispatch({ type: 'REMOVE_TAG', tag: tagToRemove });
  };

  const handleTechnologyChange = (techId) => {
    dispatch({ type: 'TOGGLE_TECHNOLOGY', techId });
  };

  return (
    <section id="projectDetails" className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Project Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-1">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 flex items-center">
            Title
            {validatedFields.title && <IoMdCheckmark className="ml-2 text-green-500" />}
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'title', value: e.target.value })} // Use dispatch
            className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="e.g., AI-Powered Chatbot for Customer Support"
            required
          />
          {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
        </div>
        <div className="md:col-span-1">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Project Status</label>
          <select
            name="status"
            id="status"
            value={formData.status}
            onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'status', value: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="upcoming">Upcoming</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="md:col-span-1">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
          <div className="mt-1 flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md shadow-sm focus-within:ring-blue-500 focus-within:border-blue-500">
            {formData.tags.map((tag, index) => (
              <span key={index} className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-blue-800 hover:text-blue-900 focus:outline-none"
                >
                  &times;
                </button>
              </span>
            ))}
            <input
              type="text"
              id="tags"
              value={currentTagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleAddTag}
              placeholder="e.g., AI, Web Development, Machine Learning"
              className="flex-grow border-none focus:ring-0 focus:outline-none p-0"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Add keywords that describe your project. Press space, comma, or enter to add a tag.</p>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 flex items-center">
            Description
            {validatedFields.description && <IoMdCheckmark className="ml-2 text-green-500" />}
          </label>
          {isClient && (
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={(value) => {
                dispatch({ type: 'UPDATE_FIELD', field: 'description', value });
                // setErrors(prev => ({ ...prev, description: '' })); // Errors handled in parent
              }}
              className={`mt-1 block w-full ${errors.description ? 'border border-red-500 rounded-md' : ''}`}
              placeholder="Provide a detailed description of your project, its goals, and features."
              modules={{
                toolbar: [
                  [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                  [{ size: [] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                  ['link', 'image', 'video'],
                  ['clean']
                ],
              }}
            />
          )}
          {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
        </div>
        <div className="md:col-span-2">
          <label htmlFor="technologies" className="block text-sm font-medium text-gray-700">Technologies</label>
          <p className="mt-1 text-xs text-gray-500 mb-2">Select the key technologies used in your project.</p>
          {formData.technologies.length > 0 && (
            <div className="mt-1 mb-2 flex flex-wrap items-center gap-2 p-2 border border-gray-200 rounded-md bg-gray-50">
              {formData.technologies.map(techId => {
                const selectedTech = allTechnologies.find(tech => tech._id === techId);
                return selectedTech ? (
                  <span key={techId} className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {selectedTech.name}
                    <button
                      type="button"
                      onClick={() => handleTechnologyChange(techId)}
                      className="ml-1 text-blue-800 hover:text-blue-900 focus:outline-none"
                    >
                      &times;
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          )}
          <input
            type="text"
            placeholder="Search or add technologies..."
            value={technologySearchQuery}
            onChange={(e) => handleTechnologySearch(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {showTechnologyList && (
            <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2 bg-white z-10 relative">
              {filteredTechnologies.length > 0 ? (
                filteredTechnologies.map(tech => (
                  <div key={tech._id} className="flex items-center mb-1" onMouseDown={(e) => e.preventDefault()}>
                    <input
                      type="checkbox"
                      id={`tech-${tech._id}`}
                      checked={formData.technologies.includes(tech._id)}
                      onChange={() => handleTechnologyChange(tech._id)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`tech-${tech._id}`} className="ml-2 text-sm text-gray-700 flex items-center cursor-pointer">
                      {tech.logoUrl && <Image src={tech.logoUrl} alt={tech.name} width={20} height={20} className="w-5 h-5 mr-2 object-contain" />}
                      {tech.name}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No technologies found matching your search.</p>
              )}
            </div>
          )}
          <button type="button" onClick={() => setShowAddTechnologyForm(true)} className="mt-2 text-blue-600 hover:underline text-sm">Technology not found? Add New</button>

          {showAddTechnologyForm && (
            <div className="mt-4 p-4 border border-blue-200 rounded-md bg-blue-50">
              <h4 className="font-semibold text-blue-800 mb-2">Add New Technology</h4>
              <div className="space-y-3">
                <div>
                  <label htmlFor="newTechnologyName" className="block text-sm font-medium text-blue-700">Technology Name</label>
                  <input
                    type="text"
                    id="newTechnologyName"
                    value={newTechnologyName}
                    onChange={(e) => handleNewTechnologyNameChange(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., React, Python, TensorFlow"
                  />
                </div>
                <div>
                  <label htmlFor="newTechnologyLogo" className="block text-sm font-medium text-blue-700">Technology Logo</label>
                  <input
                    type="file"
                    name="newTechnologyLogo"
                    id="newTechnologyLogo"
                    onChange={(e) => handleNewTechnologyLogoChange(e.target.files[0])}
                    className="mt-1 block w-full"
                    accept="image/*"
                  />
                  <p className="mt-1 text-xs text-gray-500">Upload a logo for the new technology (optional).</p>
                  {newTechnologyLogoPreview && (
                    <div className="mt-2 relative w-fit">
                      <Image src={newTechnologyLogoPreview} alt="Logo Preview" width={80} height={80} className="max-w-[80px] h-auto rounded-md shadow" />
                      <button
                        type="button"
                        onClick={clearNewTechnologyLogo}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs leading-none flex items-center justify-center w-5 h-5 -mt-1 -mr-1 border border-white hover:bg-red-600"
                        aria-label="Clear logo"
                      >
                        &times;
                      </button>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleAddTechnology((techId) => dispatch({ type: 'TOGGLE_TECHNOLOGY', techId }))}
                  disabled={savingNewTechnology}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {savingNewTechnology ? 'Adding...' : 'Add Technology'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTechnologyForm(false)}
                  className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-semibold text-sm hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectDetailsSection;
