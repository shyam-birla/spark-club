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
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus({ message: data.message, type: 'success' });
        setFormData({ name: '', email: '', year: '', branch: '', interests: '' });
      } else {
        setStatus({ message: data.message || 'Something went wrong.', type: 'error' });
      }
    } catch (error) {
      setStatus({ message: 'Something went wrong. Please try again.', type: 'error' });
    }
  };

  return (
    // Form container ko light theme ke liye update kiya
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6 p-8 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-black text-center">Join SPARK! Club</h2>

      {/* Saare input fields ko light theme ke anusaar style kiya */}
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        className="w-full bg-white border border-gray-300 px-4 py-3 rounded-md text-black focus:ring-black focus:border-black"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Your Email"
        className="w-full bg-white border border-gray-300 px-4 py-3 rounded-md text-black focus:ring-black focus:border-black"
        value={formData.email}
        onChange={handleChange}
      />

      <input
        type="text"
        name="year"
        placeholder="Your Year of Study (e.g., 1st Year)"
        className="w-full bg-white border border-gray-300 px-4 py-3 rounded-md text-black focus:ring-black focus:border-black"
        value={formData.year}
        onChange={handleChange}
      />

      <input
        type="text"
        name="branch"
        placeholder="Your Branch (e.g., CSE)"
        className="w-full bg-white border border-gray-300 px-4 py-3 rounded-md text-black focus:ring-black focus:border-black"
        value={formData.branch}
        onChange={handleChange}
      />

      <textarea
        name="interests"
        placeholder="Why do you want to join SPARK! Club?"
        className="w-full bg-white border border-gray-300 px-4 py-3 rounded-md text-black focus:ring-black focus:border-black"
        rows="5"
        value={formData.interests}
        onChange={handleChange}
      ></textarea>

      {/* Status message ko behtar UI diya */}
      {status.message && (
        <p className={`text-center p-3 rounded-md text-sm font-medium ${
          status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {status.message}
        </p>
      )}

      {/* Button ko humare standard black button se replace kiya */}
      <button type="submit" className="w-full bg-black text-white px-6 py-3 rounded-md font-semibold text-lg hover:opacity-80 transition-opacity disabled:bg-gray-500">
        Submit Application
      </button>
    </form>
  );
};

export default JoinForm;