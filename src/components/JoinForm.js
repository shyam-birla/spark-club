
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
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.year || !formData.branch || !formData.interests) {
      setStatus('Please fill all fields');
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
      setStatus(data.message);
      setFormData({
        name: '',
        email: '',
        year: '',
        branch: '',
        interests: ''
      });
    } catch (error) {
      setStatus('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Join SPARK! Club</h2>

      <input
        type="text"
        name="name"
        placeholder="Your Name"
        className="w-full border px-4 py-2 rounded"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Your Email"
        className="w-full border px-4 py-2 rounded"
        value={formData.email}
        onChange={handleChange}
      />

      <input
        type="text"
        name="year"
        placeholder="Your Year of Study"
        className="w-full border px-4 py-2 rounded"
        value={formData.year}
        onChange={handleChange}
      />

      <input
        type="text"
        name="branch"
        placeholder="Your Branch"
        className="w-full border px-4 py-2 rounded"
        value={formData.branch}
        onChange={handleChange}
      />

      <textarea
        name="interests"
        placeholder="Why do you want to join SPARK! Club?"
        className="w-full border px-4 py-2 rounded"
        rows="5"
        value={formData.interests}
        onChange={handleChange}
      ></textarea>

      {status && <p className="text-green-600">{status}</p>}

      <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition">
        Submit Application
      </button>
    </form>
  );
};

export default JoinForm;
