'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const EventRegistrationWrapper = ({ eventId, onRegistrationSuccess }) => {
  const { data: session } = useSession(); // User ka session data get karein

  // Initial form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNo: '',
    collegeName: '',
    honeypot: '', // Spam protection ke liye
  });

  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState(null);

  // Jab session load ho, form ko user ke data se pre-fill karein
  useEffect(() => {
    if (session?.user) {
      setFormData((prevData) => ({
        ...prevData,
        name: session.user.name || '',
        email: session.user.email || '',
      }));
    }
  }, [session]);

  // Input change ko handle karein
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Form submission ko handle karein
  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError(null);

    try {
      // API endpoint ka path zaroor check kar lein
      const response = await fetch('/api/register/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          formData, // Poora formData object bhej dein
          userEmail: session?.user?.email, // Logged-in user ka email
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || `Registration failed: ${response.statusText}`);
      }

      // Success hone par parent component ko notify karein
      if (onRegistrationSuccess) {
        onRegistrationSuccess();
      }
      setStatus('success');

    } catch (err) {
      console.error("Error during registration:", err);
      setError(err.message || "An error occurred. Please try again.");
      setStatus('error');
    }
  };
  
  // Agar registration successful ho gaya hai to form na dikhayein
  if (status === 'success') {
    return (
        <div className="text-center p-4 bg-green-100 text-green-800 rounded-md">
            <p className="font-semibold text-lg">✅ Registration Successful!</p>
            <p className="text-sm">We&#39;ve sent a confirmation to your email. See you at the event!</p>
        </div>
    );
  }

  return (
    <form onSubmit={handleRegistrationSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          disabled={!!session?.user} // Agar logged in hai to disable karein
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          disabled={!!session?.user} // Agar logged in hai to disable karein
        />
      </div>

      <div>
        <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700">Mobile Number</label>
        <input
          type="tel"
          id="mobileNo"
          name="mobileNo"
          value={formData.mobileNo}
          onChange={handleChange}
          required
          placeholder="e.g., 9876543210"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700">College Name</label>
        <input
          type="text"
          id="collegeName"
          name="collegeName"
          value={formData.collegeName}
          onChange={handleChange}
          required
          placeholder="Your college/university name"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Honeypot field (spam protection ke liye, hidden rehta hai) */}
      <input type="text" name="honeypot" value={formData.honeypot} onChange={handleChange} style={{ display: 'none' }} />

      <div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {status === 'loading' ? 'Registering...' : 'Register Now'}
        </button>
      </div>

      {error && <p className="text-center text-red-600 mt-2 text-sm">{error}</p>}
    </form>
  );
};

export default EventRegistrationWrapper;

