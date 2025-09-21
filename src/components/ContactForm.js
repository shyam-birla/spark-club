'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      } else {
        setStatus('Sorry, there was an error submitting your form. Please try again.');
      }
    } catch (error) {
      setStatus('Sorry, there was an error. Please check your connection.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
        <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-white" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
        <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-white" />
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-300">Subject</label>
        <select name="subject" id="subject" value={formData.subject} onChange={handleChange} className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-white">
          <option>General Inquiry</option>
          <option>Project Collaboration</option>
          <option>Joining the Club</option>
          <option>Sponsorship</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message</label>
        <textarea name="message" id="message" rows="4" required value={formData.message} onChange={handleChange} className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-white"></textarea>
      </div>
      <div>
        <button type="submit" className="w-full bg-orange-500 text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-orange-600 transition-colors disabled:bg-gray-500">
          Send Message
        </button>
      </div>
      {status && <p className="text-center text-gray-300 mt-4">{status}</p>}
    </form>
  );
}