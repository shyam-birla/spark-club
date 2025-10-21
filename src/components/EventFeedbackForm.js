'use client';

import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

export default function EventFeedbackForm({ eventId, onFeedbackSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    if (rating === 0) {
      setMessage('Please select a star rating.');
      setStatus('error');
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit feedback.');
      }

      setStatus('success');
      setMessage(data.message || 'Feedback submitted successfully!');
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }
      // Optionally reset form
      setRating(0);
      setComment('');
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'An unexpected error occurred.');
      console.error('Feedback submission error:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-xl font-bold text-black mb-4">Submit Your Feedback</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating:</label>
          <div className="flex">
            {[...Array(5)].map((star, index) => {
              const currentRating = index + 1;
              return (
                <label key={index}>
                  <input
                    type="radio"
                    name="rating"
                    value={currentRating}
                    onClick={() => setRating(currentRating)}
                    className="hidden"
                  />
                  <FaStar
                    className="cursor-pointer transition-colors duration-200"
                    color={currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                    size={30}
                    onMouseEnter={() => setHover(currentRating)}
                    onMouseLeave={() => setHover(0)}
                  />
                </label>
              );
            })}
          </div>
          {status === 'error' && message.includes('rating') && <p className="text-red-500 text-sm mt-1">{message}</p>}
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comments (Optional):</label>
          <textarea
            id="comment"
            name="comment"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Share your thoughts about the event..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-indigo-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {status === 'loading' ? 'Submitting...' : 'Submit Feedback'}
        </button>

        {status === 'success' && <p className="text-green-600 text-center mt-3">{message}</p>}
        {status === 'error' && !message.includes('rating') && <p className="text-red-600 text-center mt-3">{message}</p>}
      </form>
    </div>
  );
}
