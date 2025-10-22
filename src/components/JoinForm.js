
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
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for the field being changed
    setErrors(prev => ({ ...prev, [e.target.name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email format is invalid.';
    if (!formData.year.trim()) newErrors.year = 'Year of study is required.';
    if (!formData.branch.trim()) newErrors.branch = 'Branch is required.';
    if (!formData.interests.trim()) newErrors.interests = 'Interests are required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setStatus({ message: 'Please correct the errors above.', type: 'error' });
      return;
    }

    setStatus({ message: 'Submitting...', type: 'info' });

    try {
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ message: 'Thank you for your interest! We will get back to you soon.', type: 'success' });
        setFormData({ name: '', email: '', year: '', branch: '', interests: '' });
      } else {
        setStatus({ message: data.message || 'An error occurred.', type: 'error' });
      }
    } catch (error) {
      setStatus({ message: 'An error occurred while submitting the form.', type: 'error' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8 shadow-lg">
      <h2 className="text-3xl font-bold text-white mb-6">Join Our Club</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={`block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 ${errors.name ? 'border-red-500' : 'border-gray-600'} appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer`} placeholder=" " required />
            <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Full Name</label>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={`block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 ${errors.email ? 'border-red-500' : 'border-gray-600'} appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer`} placeholder=" " required />
            <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email Address</label>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <input type="text" name="year" id="year" value={formData.year} onChange={handleChange} className={`block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 ${errors.year ? 'border-red-500' : 'border-gray-600'} appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer`} placeholder=" " required />
            <label htmlFor="year" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Year of Study</label>
            {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input type="text" name="branch" id="branch" value={formData.branch} onChange={handleChange} className={`block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 ${errors.branch ? 'border-red-500' : 'border-gray-600'} appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer`} placeholder=" " required />
            <label htmlFor="branch" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Branch</label>
            {errors.branch && <p className="text-red-500 text-xs mt-1">{errors.branch}</p>}
          </div>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <textarea name="interests" id="interests" value={formData.interests} onChange={handleChange} className={`block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 ${errors.interests ? 'border-red-500' : 'border-gray-600'} appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer`} placeholder=" " required></textarea>
          <label htmlFor="interests" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Your Interests (e.g., AI, Web Dev, etc.)</label>
          {errors.interests && <p className="text-red-500 text-xs mt-1">{errors.interests}</p>}
        </div>
        <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Submit Application</button>
        {status.message && (
          <p className={`mt-4 text-sm text-center ${status.type === 'success' ? 'text-green-400' : status.type === 'error' ? 'text-red-400' : 'text-white'}`}>
            {status.message}
          </p>
        )}
      </form>
    </div>
  );
};

export default JoinForm;
