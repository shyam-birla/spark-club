'use client';

import { useState } from 'react';

const EventRegistrationForm = ({ eventTitle, eventId }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', branch: '', enrollmentNo: '', year: ''
  });
  const [status, setStatus] = useState('');
  const [disabled, setDisabled] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    setDisabled(true);

    if (!formData.name || !formData.email || !formData.mobile || !formData.branch || !formData.enrollmentNo || !formData.year) {
      setStatus('Please fill out all fields.');
      setDisabled(false);
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ ...formData, eventTitle, eventId }),
      });

      if (res.ok) {
        setStatus('Registration successful! Thank you.');
        setFormData({ name: '', email: '', mobile: '', branch: '', enrollmentNo: '', year: '' });
      } else {
        const data = await res.json();
        setStatus(data.message || 'Registration failed. Please try again.');
        setDisabled(false);
      }
    } catch (error) {
      setStatus('Something went wrong. Please try again.');
      setDisabled(false);
    }
  };

  return (
    // Form container ko light theme ke liye update kiya
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white text-black p-6 rounded-lg shadow-md space-y-4 border border-gray-200">
      {/* Heading se orange color hataya */}
      <h3 className="text-xl font-semibold mb-2 text-center text-black">Register for {eventTitle}</h3>

      {/* Saare input fields ko light theme ke liye style kiya */}
      <input
        type="text"
        name="name"
        placeholder="Your Full Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-black focus:border-black"
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email Address"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-black focus:border-black"
      />
      <input
        type="tel"
        name="mobile"
        placeholder="Your Mobile Number"
        value={formData.mobile}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-black focus:border-black"
      />
      <input
        type="text"
        name="branch"
        placeholder="Your Branch (e.g., CSE, ME)"
        value={formData.branch}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 bg-white border-gray-300 rounded-md focus:ring-black focus:border-black"
      />
      <input
        type="text"
        name="enrollmentNo"
        placeholder="Your Enrollment Number"
        value={formData.enrollmentNo}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-black focus:border-black"
      />
      <select
        name="year"
        value={formData.year}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-black focus:border-black"
      >
        <option value="" disabled>Select Your Year</option>
        <option value="1st Year">1st Year</option>
        <option value="2nd Year">2nd Year</option>
        <option value="3rd Year">3rd Year</option>
        <option value="4th Year">4th Year</option>
      </select>

      {/* Button ko humare standard black button se replace kiya */}
      <button
        type="submit"
        disabled={disabled}
        className="w-full bg-black text-white px-6 py-3 rounded-md font-semibold text-lg hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {disabled ? 'Submitting...' : 'Register Now'}
      </button>
      
      {/* Status message ko dark grey kiya */}
      {status && <p className="text-center text-gray-600 mt-4">{status}</p>}
    </form>
  );
};

export default EventRegistrationForm;