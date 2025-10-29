"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';

const ShareButtons = ({ title, description }) => {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  if (!currentUrl) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex flex-wrap gap-3 mt-4 mb-4">
      <h3 className="font-bold text-lg text-black">Share:</h3>
      <Link href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
        <button className="bg-blue-400 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-blue-500 transition-colors flex items-center gap-2">
          <FaTwitter /> Twitter
        </button>
      </Link>
      <Link href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer">
        <button className="bg-blue-700 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-blue-800 transition-colors flex items-center gap-2">
          <FaFacebook /> Facebook
        </button>
      </Link>
      <Link href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`} target="_blank" rel="noopener noreferrer">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
          <FaLinkedin /> LinkedIn
        </button>
      </Link>
    </div>
  );
};

export default ShareButtons;
