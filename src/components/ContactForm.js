'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    // ... (logic remains the same)
  };

  const handleSubmit = async (e) => {
    // ... (logic remains the same)
  };

  return (
    // Step 1: Form ko ek card structure dene ke liye ek wrapper div add kiya
    <div className="max-w-xl mx-auto bg-gray-50 p-8 rounded-lg border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input 
            type="text" 
            name="name" 
            id="name" 
            required 
            value={formData.name} 
            onChange={handleChange} 
            // Step 3: Placeholder add kiya
            placeholder="Enter your name"
            // Step 2: Dimensions behtar karne ke liye padding badhayi
            className="mt-1 block w-full bg-white border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black text-black px-4 py-3" 
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            name="email" 
            id="email" 
            required 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Enter your email"
            className="mt-1 block w-full bg-white border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black text-black px-4 py-3" 
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
          <select 
            name="subject" 
            id="subject" 
            value={formData.subject} 
            onChange={handleChange} 
            className="mt-1 block w-full bg-white border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black text-black px-4 py-3"
          >
            <option>General Inquiry</option>
            <option>Project Collaboration</option>
            <option>Joining the Club</option>
            <option>Sponsorship</option>
          </select>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
          <textarea 
            name="message" 
            id="message" 
            rows="4" 
            required 
            value={formData.message} 
            onChange={handleChange} 
            placeholder="Write your message here..."
            className="mt-1 block w-full bg-white border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black text-black px-4 py-3"
          ></textarea>
        </div>
        <div>
          <button type="submit" className="w-full bg-black text-white px-6 py-3 rounded-md font-semibold text-lg hover:opacity-80 transition-opacity disabled:opacity-50">
            Send Message
          </button>
        </div>
        {status && <p className="text-center text-gray-600 mt-4">{status}</p>}
      </form>
    </div>
  );
}