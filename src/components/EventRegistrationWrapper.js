'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const EventRegistrationWrapper = ({ eventId, onRegistrationSuccess, customRegistrationFields }) => {
  const { data: session } = useSession();

  // --- State Initialization ---
  // Form ki initial state taiyar karta hai (standard fields + custom fields)
  const getInitialFormData = () => {
    const initialData = {
      name: '', email: '', mobileNo: '', collegeName: '', honeypot: '',
    };
    if (customRegistrationFields) {
      customRegistrationFields.forEach(field => {
        if (field.name) {
          // Multi-select ke liye array, checkbox ke liye boolean, baaki ke liye string
          if (field.type === 'multiselect') {
            initialData[field.name] = [];
          } else if (field.type === 'checkbox') {
            initialData[field.name] = false;
          } else {
            initialData[field.name] = '';
          }
        }
      });
    }
    return initialData;
  };

  const [formData, setFormData] = useState(getInitialFormData);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  // Jab user logged in ho, toh form ko uski details se bhar dein
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({ ...prev, name: session.user.name || '', email: session.user.email || '' }));
    }
  }, [session]);

  // --- Input Change Handler ---
  // Sabhi type ke inputs (text, checkbox, file, etc.) ke changes ko handle karta hai
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    setFormData(prev => {
      // Single Checkbox
      if (type === 'checkbox' && !Array.isArray(prev[name])) {
        return { ...prev, [name]: checked };
      }
      // Multi-select Checkbox Group
      if (type === 'checkbox' && Array.isArray(prev[name])) {
        const currentValues = prev[name];
        if (checked) {
          return { ...prev, [name]: [...currentValues, value] }; // Add value to array
        } else {
          return { ...prev, [name]: currentValues.filter(item => item !== value) }; // Remove value from array
        }
      }
      // File Upload
      if (type === 'file') {
        return { ...prev, [name]: files[0] };
      }
      // Baki sabhi inputs (text, select, textarea, etc.)
      return { ...prev, [name]: value };
    });
  };

  // --- Form Submission Handler ---
  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError(null);

    const dataToSend = { ...formData };

    try {
      // --- YEH LINE THEEK KI GAYI HAI ---
      const response = await fetch('/api/register-event', { // '/route' yahan se hata diya gaya hai
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, formData: dataToSend, userEmail: session?.user?.email }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || `Registration failed: ${response.statusText}`);
      }
      if (onRegistrationSuccess) onRegistrationSuccess();
      setStatus('success');
    } catch (err) {
      console.error("Error during registration:", err);
      setError(err.message || "An error occurred. Please try again.");
      setStatus('error');
    }
  };
  
  // --- Success Message ---
  if (status === 'success') {
    return (
        <div className="text-center p-4 bg-green-100 text-green-800 rounded-md">
            <p className="font-semibold text-lg">✅ Registration Successful!</p>
            <p className="text-sm">We&apos;ve sent a confirmation to your email. See you at the event!</p>
        </div>
    );
  }

  // --- Helper function to render different field types ---
  const renderField = (field) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      required: field.required || false,
      className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm",
    };

    switch (field.type) {
      case 'textarea':
        return <textarea {...commonProps} value={formData[field.name] || ''} onChange={handleChange} placeholder={field.placeholder || ''} />;
      
      case 'select':
        return (
          <select {...commonProps} value={formData[field.name] || ''} onChange={handleChange}>
            <option value="" disabled>{field.placeholder || 'Select an option'}</option>
            {field.options?.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        );

      case 'checkbox':
        return (
            <div className="flex items-center">
                <input id={field.name} name={field.name} type="checkbox" checked={formData[field.name] || false} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                <label htmlFor={field.name} className="ml-2 block text-sm text-gray-900">{field.label}</label>
            </div>
        );

      case 'multiselect':
        return (
            <div>
                <label className="text-base font-medium text-gray-900">{field.label}</label>
                <div className="mt-2 space-y-2">
                    {field.options?.map(option => (
                        <div key={option} className="flex items-center">
                            <input id={`${field.name}-${option}`} name={field.name} type="checkbox" value={option} checked={formData[field.name]?.includes(option) || false} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                            <label htmlFor={`${field.name}-${option}`} className="ml-3 block text-sm font-medium text-gray-700">{option}</label>
                        </div>
                    ))}
                </div>
            </div>
        );
      
      case 'fileUpload':
        return <input type="file" {...commonProps} onChange={handleChange} accept={field.allowedFileTypes?.join(',')} />;
        
      default: // text, email, number, etc.
        return <input type={field.type || 'text'} {...commonProps} value={formData[field.name] || ''} onChange={handleChange} placeholder={field.placeholder || ''} />;
    }
  };

  const [showForm, setShowForm] = useState(false);

  // --- Success Message ---
  if (status === 'success') {
    return (
        <div className="text-center p-4 bg-green-100 text-green-800 rounded-md">
            <p className="font-semibold text-lg">✅ Registration Successful!</p>
            <p className="text-sm">We&apos;ve sent a confirmation to your email. See you at the event!</p>
        </div>
    );
  }

  if (!showForm) {
    return (
      <div className="text-center">
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Register Now
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleRegistrationSubmit} className="space-y-6">
      {/* --- Standard Fields --- */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" disabled={!!session?.user} />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" disabled={!!session?.user} />
      </div>
      <div>
        <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700">Mobile Number</label>
        <input type="tel" id="mobileNo" name="mobileNo" value={formData.mobileNo} onChange={handleChange} required placeholder="e.g., 9876543210" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
      </div>
      <div>
        <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700">College Name</label>
        <input type="text" id="collegeName" name="collegeName" value={formData.collegeName} onChange={handleChange} required placeholder="Your college/university name" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
      </div>

      {/* --- Dynamic Custom Fields --- */}
      {customRegistrationFields && customRegistrationFields.map(field => {
        // Single checkbox ka label alag se handle hota hai
        if (field.type === 'checkbox' || field.type === 'multiselect') {
            return <div key={field.name}>{renderField(field)}</div>
        }
        return (
            <div key={field.name}>
                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.label}</label>
                {renderField(field)}
            </div>
        )
      })}

      {/* --- Submission --- */}
      <input type="text" name="honeypot" value={formData.honeypot} onChange={handleChange} style={{ display: 'none' }} />
      <div>
        <button type="submit" disabled={status === 'loading'} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400">
          {status === 'loading' ? 'Registering...' : 'Register Now'}
        </button>
      </div>
      {error && <p className="text-center text-red-600 mt-2 text-sm">{error}</p>}
    </form>
  );
};

export default EventRegistrationWrapper;




