'use client';

import { useState } from 'react';

// Event registration form with multiple inputs including year select
const EventRegistrationForm = ({ eventTitle }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    branch: '',
    enrollmentNo: '',
    year: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');

    if (!formData.name || !formData.email || !formData.mobile || !formData.branch || !formData.enrollmentNo || !formData.year) {
      setStatus('Please fill out all fields.');
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, eventTitle }),
      });

      if (res.ok) {
        setStatus('Registration successful! Thank you.');
        setFormData({ name: '', email: '', mobile: '', branch: '', enrollmentNo: '', year: '' });
      } else {
        setStatus('Registration failed. Please try again.');
      }
    } catch (error) {
      setStatus('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-gray-800 text-white p-6 rounded-lg shadow-lg space-y-4">
      <h3 className="text-xl font-semibold mb-2 text-center text-orange-400">Register for {eventTitle}</h3>

      <input
        type="text"
        name="name"
        placeholder="Your Full Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-orange-500 focus:border-orange-500"
      />

      <input
        type="email"
        name="email"
        placeholder="Your Email Address"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-orange-500 focus:border-orange-500"
      />

      <input
        type="tel"
        name="mobile"
        placeholder="Your Mobile Number"
        value={formData.mobile}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-orange-500 focus:border-orange-500"
      />

      <input
        type="text"
        name="branch"
        placeholder="Your Branch (e.g., CSE, ME)"
        value={formData.branch}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-orange-500 focus:border-orange-500"
      />

      <input
        type="text"
        name="enrollmentNo"
        placeholder="Your Enrollment Number"
        value={formData.enrollmentNo}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-orange-500 focus:border-orange-500"
      />
      
      <select
        name="year"
        value={formData.year}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-orange-500 focus:border-orange-500"
      >
        <option value="" disabled>Select Your Year</option>
        <option value="1st Year">1st Year</option>
        <option value="2nd Year">2nd Year</option>
        <option value="3rd Year">3rd Year</option>
        <option value="4th Year">4th Year</option>
      </select>

      <button
        type="submit"
        className="w-full bg-orange-500 text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-orange-600 transition-colors disabled:bg-gray-500"
      >
        Register Now
      </button>
      
      {status && <p className="text-center text-gray-300 mt-4">{status}</p>}
    </form>
  );
};

export default EventRegistrationForm;