"use client";

import React, { useState, useEffect } from 'react';
import { client } from '../../sanity/lib/client'; // Adjust path as necessary
import { useSession } from 'next-auth/react'; // Assuming next-auth is used for session management

const UserCertificatesDisplay = () => {
  const { data: session, status } = useSession();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserCertificates = async () => {
      if (status === 'loading') return; // Wait for session to load
      if (!session || !session.user || !session.user.email) {
        setLoading(false);
        setError('User not authenticated.');
        return;
      }

      setLoading(true);
      setError('');

      try {
        // First, get the user's profile ID based on their email
        const userProfile = await client.fetch(
          `*[_type == "profile" && userEmail == $email][0]{_id}`,
          { email: session.user.email }
        );

        if (!userProfile) {
          setError('User profile not found.');
          setLoading(false);
          return;
        }

        const fetchedCertificates = await client.fetch(
          `*[_type == "certificate" && userProfile._ref == $userId]{
            _id,
            title,
            issueDate,
            verificationUrl,
            "certificateFileUrl": certificateFile.asset->url,
            event->{title, slug},
            roadmap->{title, slug}
          }`,
          { userId: userProfile._id }
        );
        setCertificates(fetchedCertificates);
      } catch (err) {
        console.error('Error fetching user certificates:', err);
        setError('Failed to load certificates: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCertificates();
  }, [session, status]);

  if (loading) {
    return <div className="text-center py-8">Loading certificates...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  if (certificates.length === 0) {
    return <div className="text-center py-8 text-gray-600">No certificates issued yet.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Certificates</h2>
      <div className="space-y-4">
        {certificates.map((cert) => (
          <div key={cert._id} className="border p-4 rounded-md shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">{cert.title}</h3>
            {cert.event && (
              <p className="text-gray-600">For Event: <span className="font-medium">{cert.event.title}</span></p>
            )}
            {cert.roadmap && (
              <p className="text-gray-600">For Roadmap: <span className="font-medium">{cert.roadmap.title}</span></p>
            )}
            <p className="text-gray-600">Issued On: {new Date(cert.issueDate).toLocaleDateString()}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {cert.certificateFileUrl && (
                <a
                  href={cert.certificateFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-none flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Certificate
                </a>
              )}
              {cert.verificationUrl && (
                <a
                  href={cert.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-none flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Verify Certificate
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserCertificatesDisplay;
