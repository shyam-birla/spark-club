'use client';

import { useState } from 'react';
import { LinkedinShareButton, WhatsappIcon, LinkedinIcon } from 'react-share';
import { FaLink } from 'react-icons/fa';

export default function SocialShare({ url, title }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const customMessage = `Hey! I found this interesting event: '${title}'. I think you'd like it. Check it out here:`;
  const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(`${customMessage} ${url}`)}`;

  return (
    <div className="flex items-center gap-4 mt-4">
      <p className="font-semibold">Share this event:</p>
      <a href={whatsappUrl} data-action="share/whatsapp/share" target="_blank" rel="noopener noreferrer">
        <WhatsappIcon size={32} round />
      </a>
      <LinkedinShareButton url={url} title={customMessage}>
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
      <button onClick={copyToClipboard} className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full">
        <FaLink />
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  );
}
