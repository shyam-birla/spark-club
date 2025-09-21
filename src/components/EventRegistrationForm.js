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
    year: '' // Added year field
  });

  const [status, setStatus] = useState(null);

  // Handle changes to any form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields including year
    if (
      !formData.name ||
      !formData.email ||
      !formData.mobile ||
      !formData.branch ||
      !formData.enrollmentNo ||
      !formData.year
    ) {
      setStatus('Please fill all fields');
      return;
    }

    try {
      const res = await fetch('/api/register', {
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
        mobile: '',
        branch: '',
        enrollmentNo: '',
        year: ''
      });
    } catch (error) {
      setStatus('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4">
      <h3 className="text-xl font-semibold mb-2">Register for {eventTitle}</h3>

      {/* Name input */}
      <input
        type="text"
        name="name"
        placeholder="Your Full Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded"
      />

      {/* Email input */}
      <input
        type="email"
        name="email"
        placeholder="Your Email Address"
        value={formData.email}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded"
      />

      {/* Mobile input */}
      <input
        type="tel"
        name="mobile
