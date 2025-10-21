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