
'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const researchAreas = ['ai-ml', 'blockchain-web3', 'cybersecurity', 'iot', 'dsai', 'other'];

export default function ResearchDetailsSection({ formData, dispatch, errors }) {
  const handleQuillChange = (value) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'description', value });
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'title', value: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <select
          name="status"
          id="status"
          value={formData.status}
          onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'status', value: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="published">Published</option>
        </select>
      </div>
      <div>
        <label htmlFor="researchArea" className="block text-sm font-medium text-gray-700">Research Area</label>
        <select
          name="researchArea"
          id="researchArea"
          value={formData.researchArea}
          onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'researchArea', value: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="">Select an Area</option>
          {researchAreas.map(area => (
            <option key={area} value={area}>
              {area.replace('-', ' ').toUpperCase()}
            </option>
          ))}
        </select>
        {errors.researchArea && <p className="text-red-500 text-xs mt-1">{errors.researchArea}</p>}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Abstract)</label>
        <ReactQuill
          theme="snow"
          value={formData.description}
          onChange={handleQuillChange}
          className="mt-1 block w-full"
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
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>
    </div>
  );
}