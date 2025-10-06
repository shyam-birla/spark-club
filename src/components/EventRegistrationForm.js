'use client';
import { useState } from 'react';

const EventRegistrationForm = ({ eventTitle, eventId, onRegistrationSuccess }) => {
    const [formData, setFormData] = useState({ name: '', email: '', mobile: '', branch: '', enrollmentNo: '', year: '' });
    const [status, setStatus] = useState('');
    const [errors, setErrors] = useState({});
    const [disabled, setDisabled] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required.';
        if (!formData.email) newErrors.email = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email format is invalid.';
        if (!formData.mobile) newErrors.mobile = 'Mobile number is required.';
        else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Mobile number must be 10 digits.';
        if (!formData.branch.trim()) newErrors.branch = 'Branch is required.';
        if (!formData.enrollmentNo.trim()) newErrors.enrollmentNo = 'Enrollment number is required.';
        if (!formData.year) newErrors.year = 'Year is required.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            setStatus('Please correct the errors above.');
            return;
        }
        
        setStatus('Submitting...');
        setDisabled(true);

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, eventTitle, eventId, honeypot: e.target.honeypot.value }),
            });

            if (res.ok) {
                // Form ko reset ya hide karne ke liye parent component ko batayein
                if (onRegistrationSuccess) onRegistrationSuccess();
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
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white text-black p-6 rounded-lg space-y-4 border border-gray-200" noValidate>
            {/* SPAM PROTECTION: Honeypot field (hidden from users) */}
            <div className="absolute left-[-5000px]" aria-hidden="true">
                <input type="text" name="honeypot" tabIndex="-1" autoComplete="off" />
            </div>

            <h3 className="text-xl font-semibold mb-2 text-center text-black">Register for {eventTitle}</h3>

            <div>
                <input type="text" name="name" placeholder="Your Full Name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-black focus:border-black" />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
                <input type="email" name="email" placeholder="Your Email Address" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-black focus:border-black" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
                <input type="tel" name="mobile" placeholder="Your Mobile Number" value={formData.mobile} onChange={handleChange} required className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-black focus:border-black" />
                {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
            </div>
            <div>
                <input type="text" name="branch" placeholder="Your Branch (e.g., CSE, ME)" value={formData.branch} onChange={handleChange} required className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-black focus:border-black" />
                {errors.branch && <p className="text-red-500 text-sm mt-1">{errors.branch}</p>}
            </div>
            <div>
                <input type="text" name="enrollmentNo" placeholder="Your Enrollment Number" value={formData.enrollmentNo} onChange={handleChange} required className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-black focus:border-black" />
                {errors.enrollmentNo && <p className="text-red-500 text-sm mt-1">{errors.enrollmentNo}</p>}
            </div>
            <div>
                <select name="year" value={formData.year} onChange={handleChange} required className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-black focus:border-black">
                    <option value="" disabled>Select Your Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                </select>
                {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
            </div>
            
            <button type="submit" disabled={disabled} className="w-full bg-black text-white px-6 py-3 rounded-md font-semibold text-lg hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                {disabled ? 'Submitting...' : 'Register Now'}
            </button>
            
            {status && !status.includes('successful') && <p className="text-center text-gray-600 mt-4">{status}</p>}
        </form>
    );
};

export default EventRegistrationForm;