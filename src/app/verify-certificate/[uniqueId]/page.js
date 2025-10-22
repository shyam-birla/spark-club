"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { client } from '../../../../sanity/lib/client'; // Adjust path as necessary

const VerifyCertificatePage = () => {
  const { uniqueId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!uniqueId) {
      setLoading(false);
      setError('No unique ID provided for verification.');
      return;
    }

    const fetchCertificate = async () => {
      setLoading(true);
      setError('');
      try {
        const fetchedCertificate = await client.fetch(
          `*[_type == "certificate" && uniqueId == $uniqueId][0]{
            _id,
            title,
            issueDate,
            verificationUrl,
            "certificateFileUrl": certificateFile.asset->url,
            event->{title, slug, description, universityLogo, learningOutcomes, skillsGained},
            userProfile->{userName, email, profilePicture}
          }`,
          { uniqueId }
        );

        if (fetchedCertificate) {
          setCertificate(fetchedCertificate);
        } else {
          setError('Certificate not found or invalid ID.');
        }
      } catch (err) {
        console.error('Error fetching certificate for verification:', err);
        setError('Failed to load certificate details: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [uniqueId]);

  if (loading) {
    return <div className="text-center py-8">Loading certificate details...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  if (!certificate) {
    return <div className="text-center py-8 text-gray-600">Certificate not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <a href="#" className="hover:underline">Accomplishments</a> &gt; <a href="#" className="hover:underline">Certificate Course</a>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column (Main Content - approx 60%) */}
          <div className="lg:w-3/5 space-y-8">
            {/* Title */}
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              {certificate.event?.title || certificate.title}
            </h1>

            {/* Recipient Block */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                {certificate.userProfile?.profilePicture ? (
                  <img
                    src={certificate.userProfile.profilePicture}
                    alt={certificate.userProfile.userName}
                    className="w-16 h-16 rounded-full mr-4 object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full mr-4 bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-semibold">{certificate.userProfile?.userName ? certificate.userProfile.userName.charAt(0) : 'U'}</div>
                )}
                <div>
                  <p className="text-lg font-semibold text-gray-800">Completed by {certificate.userProfile?.userName || 'N/A'}</p>
                  <p className="text-sm text-gray-500">Issued On: {new Date(certificate.issueDate).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-gray-700">This certifies successful completion of the course, demonstrating a strong understanding of the subject matter.</p>
              <p className="text-sm text-gray-500 mt-2">Verification ID: {certificate.uniqueId}</p>
            </div>

            {/* Course Details Block */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                {certificate.event?.universityLogo ? (
                  <img
                    src={certificate.event.universityLogo}
                    alt="University Logo"
                    className="h-10 mr-4"
                  />
                ) : (
                  <div className="h-10 w-10 mr-4 bg-gray-200 flex items-center justify-center text-gray-500">Logo</div>
                )}
                <h3 className="text-xl font-semibold text-gray-800">{certificate.event?.title || 'Course Title'}</h3>
              </div>
              <p className="text-gray-700 mb-4">{certificate.event?.description || 'A comprehensive course covering key concepts and practical applications.'}</p>
              {/* Placeholder for ratings/enrollment */}
              <div className="text-sm text-gray-500">Ratings: ★★★★☆ (4.5/5) | Enrolled: 123,456</div>
            </div>

            {/* Learning Outcomes */}
            {certificate.event?.learningOutcomes && certificate.event.learningOutcomes.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">What You Will Learn</h3>
                <ul className="list-none space-y-2">
                  {certificate.event.learningOutcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills Gained */}
            {certificate.event?.skillsGained && certificate.event.skillsGained.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Skills You Will Gain</h3>
                <div className="flex flex-wrap gap-2">
                  {certificate.event.skillsGained.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Certificate Image - approx 40%) */}
          <div className="lg:w-2/5 space-y-6">
            {/* Certificate Image/Embed */}
            <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-300">
              {certificate.certificateFileUrl ? (
                <iframe
                  src={certificate.certificateFileUrl}
                  width="100%"
                  height="400px" // Adjust height as needed
                  style={{ border: '1px solid #e2e8f0' }}
                  title="Certificate Preview"
                ></iframe>
              ) : (
                <div className="w-full h-400px bg-gray-200 flex items-center justify-center text-gray-500">No Certificate Preview Available</div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Share Certificate
              </button>
              {certificate.certificateFileUrl && (
                <a
                  href={certificate.certificateFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-bold py-3 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Download Certificate
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Footer Placeholder */}
        <div className="mt-10 p-6 bg-gray-800 text-white text-center rounded-lg">
          <p>&copy; 2025 Spark Community. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="hover:underline">Coursera</a>
            <a href="#" className="hover:underline">Community</a>
            <a href="#" className="hover:underline">More</a>
            <a href="#" className="hover:underline">Mobile App</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificatePage;
