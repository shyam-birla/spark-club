import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaPaperPlane, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useSearchParams } from 'next/navigation';

const EventRegistrationWrapper = ({ eventId, onRegistrationSuccess, customRegistrationFields }) => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  // --- State Initialization ---
  // Form ki initial state taiyar karta hai (standard fields + custom fields)
  const getInitialFormData = () => {
    const initialData = {
      name: '', email: '', mobileNo: '', collegeName: '', honeypot: '',
    };
    if (customRegistrationFields) {
      customRegistrationFields.forEach(field => {
        if (field.name) {
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
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Email Verification States (keeping for future use, but not actively used for blocking registration)
  const [verificationSent, setVerificationSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailVerificationError, setEmailVerificationError] = useState(null);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  // Effect to pre-fill form with session data
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({ ...prev, name: session.user.name || '', email: session.user.email || '' }));
    }
  }, [session]);

  // Effect to handle magic link verification callback (keeping for future use)
  useEffect(() => {
    const verificationStatus = searchParams.get('verificationStatus');
    const verifiedEmail = searchParams.get('email');

    if (verificationStatus === 'success' && verifiedEmail === formData.email) {
      setIsEmailVerified(true);
      setVerificationSent(false); // Reset this as verification is complete
      setEmailVerificationError(null);
      // alert('Email successfully verified! You can now complete your registration.'); // Alert removed
    } else if (verificationStatus === 'expired') {
      setEmailVerificationError('Verification link expired. Please resend.');
      setIsEmailVerified(false);
    } else if (verificationStatus === 'alreadyVerified') {
      setIsEmailVerified(true);
      setEmailVerificationError(null);
      // alert('Email was already verified. You can now complete your registration.'); // Alert removed
    } else if (verificationStatus && verifiedEmail !== formData.email) {
      setEmailVerificationError('Verification email mismatch. Please try again.');
      setIsEmailVerified(false);
    }
  }, [searchParams, formData.email]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    setFormData(prev => {
      if (type === 'checkbox' && !Array.isArray(prev[name])) {
        return { ...prev, [name]: checked };
      }
      if (type === 'checkbox' && Array.isArray(prev[name])) {
        const currentValues = prev[name];
        if (checked) {
          return { ...prev, [name]: [...currentValues, value] };
        } else {
          return { ...prev, [name]: currentValues.filter(item => item !== value) };
        }
      }
      if (type === 'file') {
        return { ...prev, [name]: files[0] };
      }
      return { ...prev, [name]: value };
    });
  };

  // handleSendVerificationEmail is kept for future use, but not called directly from UI now
  const handleSendVerificationEmail = async () => {
    setEmailVerificationError(null);
    setIsVerifyingEmail(true);
    try {
      const response = await fetch('/api/events/send-verification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, eventId }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to send verification email.');
      }

      setVerificationSent(true);
      alert('Verification email sent! Please check your inbox and spam folder.');
    } catch (err) {
      console.error("Error sending verification email:", err);
      setEmailVerificationError(err.message || 'An error occurred while sending the verification email.');
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();

    // Removed: if (!isEmailVerified) { ... }

    setStatus('loading');
    setError(null);

    const formDataToSend = new FormData();
    formDataToSend.append('eventId', eventId);
    formDataToSend.append('userEmail', session?.user?.email || '');

    // Append standard fields
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('mobileNo', formData.mobileNo);
    formDataToSend.append('collegeName', formData.collegeName);
    formDataToSend.append('honeypot', formData.honeypot);

    // Append custom fields, handling files specifically
    if (customRegistrationFields) {
      customRegistrationFields.forEach(field => {
        const value = formData[field.name];
        if (field.type === 'fileUpload' && value instanceof File) {
          formDataToSend.append(field.name, value, value.name); // Append File object
        } else if (Array.isArray(value)) {
          // Handle multi-selects/checkbox groups as arrays
          value.forEach(item => formDataToSend.append(field.name, item));
        } else if (value !== undefined && value !== null) {
          formDataToSend.append(field.name, String(value));
        }
      });
    }

    try {
      const response = await fetch('/api/register-event', {
        method: 'POST',
        // Content-Type header is automatically set to multipart/form-data by the browser when sending FormData
        body: formDataToSend,
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
  
  // --- Helper function to render different field types ---
  const renderField = (field) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      required: field.required || false,
      className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400",
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
          className="inline-flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
      </div>
      <div>
        <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700">Mobile Number</label>
        <input type="tel" id="mobileNo" name="mobileNo" value={formData.mobileNo} onChange={handleChange} required placeholder="e.g., 9876543210" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400" />
      </div>
      <div>
        <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700">College Name</label>
        <input type="text" id="collegeName" name="collegeName" value={formData.collegeName} onChange={handleChange} required placeholder="Your college/university name" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400" />
      </div>

      {/* --- Dynamic Custom Fields --- */}
      {customRegistrationFields && customRegistrationFields.map(field => {
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

      {/* --- Email Verification Section (kept for future use, but not rendered) --- */}
      {/*
      {!isEmailVerified && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <p className="text-sm text-gray-600 mb-2">Please verify your email address to complete registration.</p>
          <button
            type="button"
            onClick={handleSendVerificationEmail}
            disabled={isVerifyingEmail || !formData.email}
            className="inline-flex mx-auto justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {isVerifyingEmail ? (
              <><FaPaperPlane className="animate-pulse mr-2" /> Sending Verification Email...</>
            ) : (
              <><FaPaperPlane className="mr-2" /> Send Verification Email</>
            )}
          </button>
          {verificationSent && !emailVerificationError && (
            <p className="text-green-600 text-sm mt-2 flex items-center justify-center"><FaCheckCircle className="mr-1" /> Verification email sent! Check your inbox.</p>
          )}
          {emailVerificationError && (
            <p className="text-red-600 text-sm mt-2 flex items-center justify-center"><FaExclamationCircle className="mr-1" /> {emailVerificationError}</p>
          )}
        </div>
      )}
      */}

      {/* --- Submission --- */}
      <input type="text" name="honeypot" value={formData.honeypot} onChange={handleChange} style={{ display: 'none' }} />
      <div className="text-center">
        <button type="submit" disabled={status === 'loading'} className="inline-flex mx-auto justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400">
          {status === 'loading' ? 'Registering...' : 'Register Now'}
        </button>
      </div>
      {error && <p className="text-center text-red-600 mt-2 text-sm">{error}</p>}
    </form>
  );
};

export default EventRegistrationWrapper;




