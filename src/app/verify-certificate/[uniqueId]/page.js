"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // Import Image
import { client } from '../../../../sanity/lib/client';
import PortableTextComponent from '../../../components/PortableTextComponent';
import { FaDownload, FaShareAlt, FaLinkedin, FaWhatsapp, FaLink, FaCheckCircle, FaInstagram, FaGithub, FaEnvelope, FaHome, FaUserCircle, FaAward, FaCalendarAlt, FaTools, FaExclamationTriangle, FaSearch } from 'react-icons/fa';
import { format } from 'date-fns';

const VerifyCertificatePage = () => {
  const { uniqueId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  const socialIconMap = {
    linkedin: FaLinkedin,
    whatsapp: FaWhatsapp,
    instagram: FaInstagram,
    github: FaGithub,
    gmail: FaEnvelope,
  };

  useEffect(() => {
    if (!uniqueId) {
      setLoading(false);
      setError('No unique ID provided for verification.');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [fetchedCertificate, fetchedSocialLinks] = await Promise.all([
          client.fetch(
            `*[_type == "certificate" && uniqueId == $uniqueId][0]{
              _id,
              title,
              issueDate,
              verificationUrl,
              "certificateFileUrl": certificateFile.asset->url,
              event->{
                title,
                slug,
                description,
                universityLogo,
                learningOutcomes,
                skillsGained,
                "coverImage": coverImage.asset->url,
                eventDate,
                endDate,
                venue,
                hostedBy[]->{name, "logo": logo.asset->url}
              },
              userProfile->{
                userName,
                email,
                mobileNumber,
                "profilePicture": userImage.asset->url
              }
            }`,
            { uniqueId }
          ),
          client.fetch(
            `*[_type == "socialLink"]{name, url, icon}`
          ),
        ]);

        if (fetchedCertificate) {
          setCertificate(fetchedCertificate);
          console.log('Debug: Full certificate object', fetchedCertificate);
        } else {
          setError('Certificate not found or invalid ID.');
        }
        setSocialLinks(fetchedSocialLinks || []);
      } catch (err) {
        console.error('Error fetching data for verification:', err);
        setError('Failed to load certificate details: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uniqueId]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Certificate from ${hostedBy} for ${certificate.event?.title || certificate.title}`,
        text: `Check out my certificate from ${hostedBy} for ${certificate.event?.title || certificate.title}! Verify it here: ${certificate.verificationUrl}`,
        url: certificate.verificationUrl,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that do not support the Web Share API
      navigator.clipboard.writeText(certificate.verificationUrl);
      setCopySuccess('Link copied!');
      setTimeout(() => setCopySuccess(''), 3000);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading certificate details...</div>;
  }

  if (error) {
    return (
      <main className="bg-gray-50/50 backdrop-blur-sm py-12 md:py-20 min-h-screen">
        <div className="container mx-auto p-4 text-center text-red-600 bg-white rounded-lg shadow-md py-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2"><FaExclamationTriangle className="text-red-500" /> ERROR 500: Internal Server Error (Probably)</h1>
          <p className="text-lg mb-4">My apologies, human. It seems I encountered an unexpected exception while trying to verify this certificate.</p>
          <p className="text-sm text-gray-700"><strong>Stack Trace (simplified):</strong> {error}</p>
          <p className="text-sm text-gray-700 mt-2">Initiating self-repair protocols... (Just kidding, try a page refresh. If that fails, alert the nearest developer with the above error details!)</p>
        </div>
      </main>
    );
  }

  if (!certificate) {
    return (
      <main className="bg-gray-50/50 backdrop-blur-sm py-12 md:py-20 min-h-screen">
        <div className="container mx-auto p-4 text-center text-red-600 bg-white rounded-lg shadow-md py-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2"><FaSearch className="text-red-500" /> ERROR 404: Certificate Not Found!</h1>
          <p className="text-lg mb-4">My apologies, human. It seems this certificate has gone missing in the digital ether or never existed.</p>
          <p className="text-sm text-gray-700 mt-2">Initiating quantum search protocols... (Just kidding, double-check the ID. If that fails, the certificate might be a myth!)</p>
        </div>
      </main>
    );
  }

  const eventTitle = certificate.event?.title || certificate.title;
  const userName = certificate.userProfile?.userName || 'N/A';
  const issueDate = certificate.issueDate ? format(new Date(certificate.issueDate), 'MMMM dd, yyyy') : 'N/A';
  const eventDateStart = certificate.event?.eventDate ? format(new Date(certificate.event.eventDate), 'MMMM dd, yyyy, hh:mm a') : 'N/A';
  const eventDateEnd = certificate.event?.endDate ? format(new Date(certificate.event.endDate), 'MMMM dd, yyyy, hh:mm a') : '';
  const eventDates = eventDateEnd ? `${eventDateStart} - ${eventDateEnd}` : eventDateStart;
  const eventType = certificate.event?.venue?.type || 'N/A';
  const eventVenue = certificate.event?.venue?.locationName || 'N/A';
  const eventSlug = certificate.event?.slug?.current;
  const hostedBy = certificate.event?.hostedBy?.[0]?.name || 'SPARK Community';

  console.log('Debug: certificate.uniqueId', certificate.uniqueId);
  console.log('Debug: hostedBy', hostedBy);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600 flex items-center gap-2">
          <FaHome className="text-gray-500" /><Link href="/" className="hover:underline">Home</Link> &gt; <FaUserCircle className="text-gray-500" /><a href="/profile" className="hover:underline">Accomplishments</a> &gt; <span className="font-semibold">Certificate Course</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column (Main Content - approx 60%) */}
                    <div className="lg:w-3/5 space-y-8">
                                  <div className="flex flex-col lg:flex-row gap-8">
                                    {/* Event Banner */}
                                    {certificate.event?.coverImage && (
                                      <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-md lg:w-1/3">
                                        <Image
                                          src={certificate.event.coverImage}
                                          alt={`${eventTitle} Banner`}
                                          fill
                                          style={{ objectFit: 'contain' }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <h1 className="absolute bottom-4 left-4 text-white text-xl font-bold">{eventTitle}</h1>
                                      </div>
                                    )}
                      
                                    {/* Recipient Block */}
                                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 lg:w-2/3">
                          <div className="flex items-center mb-4">
                                              {certificate.userProfile?.profilePicture ? (
                                                <Image
                                                  src={certificate.userProfile.profilePicture}
                                                  alt={userName}
                                                  width={96}
                                                  height={96}
                                                  className="rounded-full mr-4 object-cover"
                                                />
                                              ) : (
                                                <div className="w-24 h-24 rounded-full mr-4 bg-gray-200 flex items-center justify-center text-gray-500 text-3xl font-semibold">{userName.charAt(0)}</div>
                                              )}
                                              <div>
                                                <p className="text-lg font-semibold text-gray-800 flex items-center gap-2"><FaAward className="text-yellow-500" /> Certificate Awarded to <span className="text-2xl font-extrabold text-black">{userName}</span></p>
                                                <p className="text-sm text-gray-500">on {issueDate}</p>
                                              </div>                          </div>
                          <p className="text-gray-700">{hostedBy} confirms that {userName} successfully participated in this event.</p>
                        </div>
                      </div>
            {/* Event Details Block */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                {/* Placeholder for SPARK Logo */}
                <Image src="/logo-black.png" alt="SPARK Logo" width={32} height={32} className="mr-3" />
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2"><FaCalendarAlt className="text-blue-500" /> Event Details</h3>
              </div>
              <p className="text-gray-700 mb-2"><strong>Date:</strong> {eventDates}</p>
              <p className="text-gray-700 mb-2"><strong>Type:</strong> {eventType}</p>
              <p className="text-gray-700 mb-4"><strong>Venue:</strong> {eventVenue}</p>
              {eventSlug && (
                <a
                  href={`/events/${eventSlug}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Event Details
                </a>
              )}
            </div>

            {/* Verification Details Block */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <FaCheckCircle className="text-green-500 text-2xl mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Verification Details</h3>
              </div>
              <p className="text-gray-700 mb-2"><strong>Status:</strong> <span className="text-green-600">Verified</span></p>
              {/* TODO: Certificate ID is blank if uniqueId is not populated in Sanity. Please ensure uniqueId is set for certificate documents. */}
              <p className="text-gray-700 mb-2"><strong>Certificate ID:</strong> {certificate.uniqueId || (certificate.userProfile?.mobileNumber ? `(Fallback: ${certificate.userProfile.mobileNumber.substring(0, 5)}...)` : 'N/A')}</p>
              <p className="text-gray-700"><strong>Issued by:</strong> {hostedBy}</p>
            </div>

            {/* Learning Outcomes */}
            {certificate.event?.learningOutcomes && certificate.event.learningOutcomes.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">What You Will Learn</h3>
                <ul className="list-none space-y-2">
                  {certificate.event.learningOutcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <FaCheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span>
                        {typeof outcome === 'object' && outcome !== null && '_type' in outcome ? (
                          <PortableTextComponent blocks={[outcome]} />
                        ) : (
                          outcome
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills Gained */}
            {certificate.event?.skillsGained && certificate.event.skillsGained.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaTools className="text-purple-500" /> Skills You Will Gain</h3>
                <div className="flex flex-wrap gap-2">
                  {certificate.event.skillsGained.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                      {typeof skill === 'object' && skill !== null && '_type' in skill ? (
                        <PortableTextComponent blocks={[skill]} />
                      ) : (
                        skill
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Certificate & Actions - approx 40%) */}
          <div className="lg:w-2/5 space-y-6">
            {/* Certificate Image */}
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
                <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center text-gray-500">No Certificate Preview Available</div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row space-x-3">
              {certificate.certificateFileUrl && (
                <a
                  href={certificate.certificateFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-1/2 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaDownload className="mr-2" /> Download Certificate
                </a>
              )}
              <button
                onClick={handleShare}
                className="w-1/2 flex items-center justify-center border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 font-bold py-3 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaShareAlt className="mr-2" /> Share Certificate
              </button>
            </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2025 Spark Community. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {socialLinks.map((link, index) => {
              if (!link) return null;
              const IconComponent = socialIconMap[link.icon];
              if (!IconComponent) return null;
              return (
                <a key={link._id || index} href={link.url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400">
                  <IconComponent className="text-2xl" />
                </a>
              );
            })}
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default VerifyCertificatePage;
