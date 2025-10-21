'use client';

import React, { useState } from 'react';
import DynamicRegistrationForm from './DynamicRegistrationForm';
import { useSession } from 'next-auth/react'; // 1. Import useSession to get user data

const EventRegistrationWrapper = ({ customRegistrationFields, eventId, onRegistrationSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { data: session } = useSession(); // 2. Get the user's session

  const handleRegistrationSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    console.log("Submitting dynamic form data:", formData);

    try {
      const response = await fetch('/api/register-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 3. Send eventId, all form data, and the user's email to the API
        body: JSON.stringify({ 
            eventId, 
            formData, 
            userEmail: session?.user?.email // Pass the logged-in user's email
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || `Registration failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Registration API Response:", result);
      
      // 4. Notify the parent component (RegistrationStatus) of the success
      if(onRegistrationSuccess) {
        onRegistrationSuccess();
      } else {
        alert("Registration successful!");
      }

    } catch (error) {
      console.error("Error during registration:", error);
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If the admin hasn't added any fields in Sanity, show a message
  if (!customRegistrationFields || customRegistrationFields.length === 0) {
    return (
      <div className="text-center p-4 bg-yellow-100 text-yellow-800 rounded-md">
        <p className="font-semibold">Registration form is not yet configured for this event.</p>
        <p className="text-sm">Please check back later or contact event organizers.</p>
      </div>
    );
  }

  return (
    <div>
      <DynamicRegistrationForm
        customRegistrationFields={customRegistrationFields}
        onSubmit={handleRegistrationSubmit}
      />
      {isSubmitting && <p className="text-center text-blue-600 mt-4">Submitting, please wait...</p>}
      {error && <p className="text-center text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default EventRegistrationWrapper;