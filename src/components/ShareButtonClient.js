
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const ShareButtonClient = ({ projectTitle, projectDescription, shareType, children }) => {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  if (!currentUrl) {
    return null; // Or a loading spinner
  }

  let shareHref = "";
  switch (shareType) {
    case "twitter":
      shareHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(projectTitle)}`;
      break;
    case "facebook":
      shareHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
      break;
    case "linkedin":
      shareHref = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(projectTitle)}&summary=${encodeURIComponent(projectDescription)}`;
      break;
    default:
      shareHref = "#"; // Fallback or error handling
  }

  return (
    <Link
      href={shareHref}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  );
};

export default ShareButtonClient;
