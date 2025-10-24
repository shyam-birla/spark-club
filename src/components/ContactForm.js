'use client';
import { useState } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaBuilding, FaMapPin, FaTag, FaComment, FaPaperPlane } from 'react-icons/fa';

export default function ContactForm() {
    const [formData, setFormData] = useState({
      name: '',
      mobileNo: '',
      email: '',
      university: '',
      state: '',
      subject: 'General Inquiry',
      message: ''
    });
    const [status, setStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
  
    const indianStates = [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
      "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
      "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
      "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
      "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
      "Uttar Pradesh", "Uttarakhand", "West Bengal",
      "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
      "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
    ];
  
    const validateField = (name, value) => {
      let error = '';
      if (name === 'mobileNo') {
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(value)) {
          error = 'Invalid mobile number (10 digits, starts with 6-9)';
        }
      } else if (name === 'email') {
        const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(value)) {
          error = 'Invalid email address';
        }
      }
      return error;
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
  
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Validate all fields before submission
      let newErrors = {};
      Object.keys(formData).forEach((name) => {
        const error = validateField(name, formData[name]);
        if (error) {
          newErrors[name] = error;
        }
      });
  
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setStatus('Please correct the errors in the form.');
        return;
      }
  
      setIsSubmitting(true);
      setStatus('Submitting...');
      
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          setStatus('Thank you for your message! We will get back to you soon.');
          setFormData({ name: '', mobileNo: '', email: '', university: '', state: '', subject: 'General Inquiry', message: '' });
          setErrors({}); // Clear errors on successful submission
        } else {
          setStatus('Sorry, there was an error submitting your form. Please try again.');
        }
      } catch (error) {
        setStatus('Sorry, there was an error. Please check your connection.');
      }
      finally {
        setIsSubmitting(false);
      }
    };
  
    return (
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-base font-medium text-gray-700 flex items-center"><FaUser className="mr-2" /><span>Name</span></label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                required 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Enter your name"
                className="mt-1 block w-full bg-gray-50 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base px-4 py-3 transition-all duration-200 placeholder-gray-500" 
              />
            </div>
            <div>
              <label htmlFor="mobileNo" className="block text-base font-medium text-gray-700 flex items-center"><FaPhone className="mr-2" /><span>Mobile No</span></label>
                          <input 
                            type="tel" 
                            name="mobileNo" 
                            id="mobileNo" 
                            required 
                            pattern="[6-9]{1}[0-9]{9}" 
                            title="Please enter a valid 10-digit Indian mobile number (e.g., 9876543210)"
                            value={formData.mobileNo} 
                            onChange={handleChange} 
                            onKeyPress={(event) => {
                              if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                            placeholder="Enter your mobile number"
                            className={`mt-1 block w-full bg-gray-50 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base px-4 py-3 transition-all duration-200 placeholder-gray-500 ${errors.mobileNo ? 'border-red-500' : ''}`}
                          />              {errors.mobileNo && <p className="text-red-500 text-xs mt-1">{errors.mobileNo}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-base font-medium text-gray-700 flex items-center"><FaEnvelope className="mr-2" /><span>Email</span></label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              required 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Enter your email"
              className={`mt-1 block w-full bg-gray-50 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base px-4 py-3 transition-all duration-200 placeholder-gray-500 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="university" className="block text-base font-medium text-gray-700 flex items-center"><FaBuilding className="mr-2" /><span>University/College/Institute</span></label>
            <input 
              type="text" 
              name="university" 
              id="university" 
              required 
              value={formData.university} 
              onChange={handleChange} 
              placeholder="Enter your university, college, or institute"
              className="mt-1 block w-full bg-gray-50 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base px-4 py-3 transition-all duration-200 placeholder-gray-500" 
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-base font-medium text-gray-700 flex items-center"><FaMapPin className="mr-2" /><span>State</span></label>
            <select 
              name="state" 
              id="state" 
              required 
              value={formData.state} 
              onChange={handleChange} 
              className="mt-1 block w-full bg-gray-50 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-base px-4 py-3 transition-all duration-200"
            >
              <option value="">Select your State</option>
              {indianStates.map((stateName) => (
                <option key={stateName} value={stateName}>{stateName}</option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="subject" className="block text-base font-medium text-gray-700 flex items-center"><FaTag className="mr-2" /><span>Subject</span></label>
            <select 
              name="subject" 
              id="subject" 
              value={formData.subject} 
              onChange={handleChange} 
              className="mt-1 block w-full bg-gray-50 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-base px-4 py-3 transition-all duration-200"
            >
              <option>General Inquiry</option>
              <option>Technical Collaboration</option>
              <option>Research Partnership</option>
              <option>Event Speaking Opportunity</option>
              <option>Mentorship Program Inquiry</option>
              <option>Project Proposal</option>
              <option>General Feedback</option>
              <option>Joining the Community</option>
              <option>Sponsorship</option>
            </select>
          </div>
          <div>
            <label htmlFor="message" className="block text-base font-medium text-gray-700 flex items-center"><FaComment className="mr-2" /><span>Message</span></label>
            <textarea 
              name="message" 
              id="message" 
              rows="4" 
              required 
              value={formData.message} 
              onChange={handleChange} 
              placeholder="Write your message here..."
              className="mt-1 block w-full bg-gray-50 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base px-4 py-3 transition-all duration-200 placeholder-gray-500"
            ></textarea>
          </div>
          <div>
            <button 
              type="submit" 
              className="block mx-auto bg-black text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FaPaperPlane className="animate-pulse mr-2" /> Sending...
                </>
              ) : (
                <>
                  <FaPaperPlane className="mr-2" /> Send Message
                </>
              )}
            </button>
          </div>
          {status && <p className={`text-center mt-4 ${status.includes('error') ? 'text-red-600' : 'text-green-600'}`}>{status}</p>}
        </form>
      </div>
    );
  }