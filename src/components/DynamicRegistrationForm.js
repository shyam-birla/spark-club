'use client';

import React, { useState } from 'react';

const DynamicRegistrationForm = ({ customRegistrationFields, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [fileUploads, setFileUploads] = useState({});
  const [uploading, setUploading] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Find the field definition to check if it's a multiselect
    const field = customRegistrationFields?.find(f => f.name === name);
    
    if (type === 'checkbox' && field && field.type === 'multiselect') {
      const currentValues = new Set(formData[name] || []);
      if (checked) {
        currentValues.add(value);
      } else {
        currentValues.delete(value);
      }
      setFormData(prev => ({ ...prev, [name]: Array.from(currentValues) }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFileUploads(prev => ({ ...prev, [fieldName]: file }));
      setFormData(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  const uploadFile = async (file, fieldName) => {
    if (!file) return null;
    setUploading(prev => ({ ...prev, [fieldName]: true }));
    const uploadUrl = '/api/upload-file';
    const formDataPayload = new FormData();
    formDataPayload.append('file', file);
    formDataPayload.append('fieldName', fieldName);
    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formDataPayload,
      });
      if (!response.ok) {
        throw new Error(`File upload failed: ${response.statusText}`);
      }
      const result = await response.json();
      return result.fileUrl; 
    } catch (error) {
      console.error(`Error uploading file for ${fieldName}:`, error);
      alert(`Failed to upload ${file.name}. Please try again.`);
      return null;
    } finally {
      setUploading(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // === YAHAN BADLAV KIYA GAYA HAI ===
    // Standard fields ke liye hard-coded validation
    if (!formData.name || !formData.name.trim()) errors.name = 'Full Name is required.';
    if (!formData.email) errors.email = 'Email is required.';
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) errors.email = 'Email format is invalid.';
    if (!formData.mobile) errors.mobile = 'Mobile number is required.';
    else if (!/^\d{10}$/.test(formData.mobile)) errors.mobile = 'Mobile number must be 10 digits.';
    if (!formData.collegeName || !formData.collegeName.trim()) errors.collegeName = 'College Name is required.';
    // === END OF CHANGE ===

    // Dynamic validation for custom fields
    for (const field of (customRegistrationFields || [])) {
      const fieldName = field.name;
      if (field.required) {
        if (field.type === 'fileUpload') {
          if (!fileUploads[fieldName] && !formData[fieldName]) {
            errors[fieldName] = `${field.label} is required.`;
          }
        } else if (!formData[fieldName] || formData[fieldName].length === 0) {
          errors[fieldName] = `${field.label} is required.`;
        }
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const uploadedFileUrls = {};
    for (const field of customRegistrationFields) {
      const fieldName = field.name;
      if (field.type === 'fileUpload' && fileUploads[fieldName]) {
        const fileUrl = await uploadFile(fileUploads[fieldName], fieldName);
        if (fileUrl) {
          uploadedFileUrls[fieldName] = fileUrl;
        } else if (field.required) {
          return;
        }
      }
    }
    const finalFormData = { ...formData, ...uploadedFileUrls };
    onSubmit(finalFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      
      {/* Hard-coded Name field */}
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          required
          placeholder="Enter your full name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
      </div>

      {/* Hard-coded Email field */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          required
          placeholder="Enter your email address"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
      </div>

      {/* === YAHAN NAYE FIELDS ADD KIYE GAYE HAIN === */}
      {/* Hard-coded Mobile Number field */}
      <div className="mb-4">
        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
          Mobile Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="mobile"
          name="mobile"
          value={formData.mobile || ''}
          onChange={handleChange}
          required
          placeholder="Enter your 10-digit mobile number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {formErrors.mobile && <p className="text-red-500 text-sm mt-1">{formErrors.mobile}</p>}
      </div>

      {/* Hard-coded College Name field */}
      <div className="mb-4">
        <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700">
          College/Institute/Organization Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="collegeName"
          name="collegeName"
          value={formData.collegeName || ''}
          onChange={handleChange}
          required
          placeholder="Enter the name of your institute"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {formErrors.collegeName && <p className="text-red-500 text-sm mt-1">{formErrors.collegeName}</p>}
      </div>
      {/* === END OF CHANGE === */}


      {(customRegistrationFields || []).map(field => {
        const fieldName = field.name;
        // Standard fields ko dobara render na karein
        if (!fieldName || ['name', 'email', 'mobile', 'collegeName'].includes(fieldName)) return null; 
        
        return (
        <div key={field._key} className="mb-4">
          <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              id={fieldName}
              name={fieldName}
              value={formData[fieldName] || ''}
              onChange={handleChange}
              required={field.required}
              placeholder={field.placeholder}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          ) : field.type === 'select' ? (
            <select
              id={fieldName}
              name={fieldName}
              value={formData[fieldName] || ''}
              onChange={handleChange}
              required={field.required}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">{field.placeholder || `Select ${field.label}`}</option>
              {field.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : field.type === 'multiselect' ? (
            <div className="mt-1 space-y-2">
              {field.options?.map(option => (
                <div key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${fieldName}-${option}`}
                    name={fieldName}
                    value={option}
                    checked={formData[fieldName]?.includes(option) || false}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <label htmlFor={`${fieldName}-${option}`} className="ml-2 block text-sm text-gray-900">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          ) : field.type === 'fileUpload' ? (
            <div className="mt-1">
              <input
                type="file"
                id={fieldName}
                name={fieldName}
                accept={field.allowedFileTypes?.join(',') || '*/*'}
                onChange={(e) => handleFileChange(e, fieldName)}
                required={field.required && !formData[fieldName]}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {fileUploads[fieldName] && <p className="mt-2 text-sm text-gray-600">Selected: {fileUploads[fieldName].name}</p>}
              {uploading[fieldName] && <p className="mt-2 text-sm text-blue-500">Uploading...</p>}
              {formData[fieldName] && !fileUploads[fieldName] && <p className="mt-2 text-sm text-green-600">File already uploaded. <a href={formData[fieldName]} target="_blank" rel="noopener noreferrer" className="underline">View</a></p>}
            </div>
          ) : (
            <input
              type={field.type}
              id={fieldName}
              name={fieldName}
              value={formData[fieldName] || ''}
              onChange={handleChange}
              required={field.required}
              placeholder={field.placeholder}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          )}
          {formErrors[fieldName] && <p className="text-red-500 text-sm mt-1">{formErrors[fieldName]}</p>}
        </div>
        )
      })}
      <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Register
      </button>
    </form>
  );
};

export default DynamicRegistrationForm;