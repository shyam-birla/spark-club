'use client';

import { useState } from 'react';

const JoinForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    year: '',
    branch: '',
    interests: ''
  });
  const [status, setStatus] = useState({ message: null, type: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.year || !formData.branch || !formData.interests) {
      setStatus({ message: 'Please fill all fields', type: 'error' });
      return;
    }

    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus({ message: data.message, type: 'success' });
        setFormData({
          name: '',
          email: '',
          year: '',
          branch: '',
          interests: ''
        });
      } else {
        setStatus({ message: data.message || 'Something went wrong.', type: 'error' });
      }
    } catch (error) {
      setStatus({ message: 'Something went wrong. Please try again.', type: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6 p-8 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-white text-center">Join SPARK! Club</h2>

      <input
        type="text"
        name="name"
        placeholder="Your Name"
        className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded-md text-white focus:ring-orange-500 focus:border-orange-500"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Your Email"
        className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded-md text-white focus:ring-orange-500 focus:border-orange-500"
        value={formData.email}
        onChange={handleChange}
      />

      <input
        type="text"
        name="year"
        placeholder="Your Year of Study"
        className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded-md text-white focus:ring-orange-500 focus:border-orange-500"
        value={formData.year}
        onChange={handleChange}
      />

      <input
        type="text"
        name="branch"
        placeholder="Your Branch"
        className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded-md text-white focus:ring-orange-500 focus:border-orange-500"
        value={formData.branch}
        onChange={handleChange}
      />

      <textarea
        name="interests"
        placeholder="Why do you want to join SPARK! Club?"
        className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded-md text-white focus:ring-orange-500 focus:border-orange-500"
        rows="5"
        value={formData.interests}
        onChange={handleChange}
      ></textarea>

      {status.message && (
        <p className={`text-center ${status.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
          {status.message}
        </p>
      )}

      <button type="submit" className="w-full bg-orange-500 text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-orange-600 transition-colors disabled:bg-gray-500">
        Submit Application
      </button>
    </form>
  );
};

export default JoinForm;
