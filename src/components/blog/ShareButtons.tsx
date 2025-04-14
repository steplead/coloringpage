import React from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
  className?: string;
}

/**
 * Social media sharing buttons component
 * Allows users to easily share blog posts on various platforms
 */
const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url, className = '' }) => {
  // Encode for sharing
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  
  // Share URLs
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`;
  const emailUrl = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
  
  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold mb-3">Share This Page</h3>
      <div className="flex flex-wrap gap-2">
        {/* Facebook */}
        <a 
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#1877f2] text-white p-2 rounded-full hover:bg-opacity-80 transition-opacity"
          aria-label="Share on Facebook"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5L14.17.5C10.5.5,9.77,3.1,9.77,5.3V7.46H7v4.54h2.77V22h4.73V12h3.77Z"/>
          </svg>
        </a>
        
        {/* Twitter */}
        <a 
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#1da1f2] text-white p-2 rounded-full hover:bg-opacity-80 transition-opacity"
          aria-label="Share on Twitter"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22,4.9c-0.8,0.3-1.7,0.6-2.6,0.7c0.9-0.6,1.6-1.4,2-2.5c-0.9,0.5-1.8,0.9-2.9,1.1c-0.8-0.9-2-1.4-3.3-1.4c-2.5,0-4.5,2-4.5,4.5c0,0.4,0,0.7,0.1,1c-3.8-0.2-7.1-2-9.3-4.8C1,4.2,0.8,5,0.8,5.8c0,1.6,0.8,2.9,2,3.8c-0.7,0-1.4-0.2-2-0.6c0,0,0,0,0,0.1c0,2.2,1.6,4,3.6,4.4c-0.4,0.1-0.8,0.2-1.2,0.2c-0.3,0-0.6,0-0.9-0.1c0.6,1.8,2.2,3.1,4.1,3.1c-1.5,1.2-3.4,1.9-5.5,1.9c-0.4,0-0.7,0-1.1-0.1c2,1.3,4.3,2,6.8,2c8.1,0,12.6-6.7,12.6-12.6c0-0.2,0-0.4,0-0.6C20.7,6.6,21.5,5.8,22,4.9z"/>
          </svg>
        </a>
        
        {/* Pinterest */}
        <a 
          href={pinterestUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#e60023] text-white p-2 rounded-full hover:bg-opacity-80 transition-opacity"
          aria-label="Share on Pinterest"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.02,0.192c-6.617,0-11.987,5.37-11.987,11.987c0,5.079,3.158,9.417,7.618,11.162c-0.105-0.949-0.199-2.403,0.041-3.439c0.217-0.937,1.401-5.966,1.401-5.966s-0.357-0.714-0.357-1.768c0-1.655,0.959-2.891,2.153-2.891c1.016,0,1.506,0.765,1.506,1.682c0,1.025-0.653,2.557-0.99,3.978c-0.281,1.189,0.597,2.159,1.771,2.159c2.128,0,3.767-2.245,3.767-5.484c0-2.872-2.064-4.877-5.013-4.877c-3.414,0-5.418,2.548-5.418,5.19c0,1.029,0.394,2.128,0.889,2.729c0.097,0.119,0.112,0.224,0.083,0.345c-0.091,0.375-0.29,1.178-0.33,1.343c-0.052,0.219-0.173,0.265-0.4,0.16c-1.495-0.698-2.428-2.888-2.428-4.645c0-3.782,2.744-7.25,7.92-7.25c4.162,0,7.395,2.967,7.395,6.93c0,4.136-2.607,7.464-6.227,7.464c-1.216,0-2.359-0.633-2.75-1.378c0,0-0.601,2.291-0.748,2.859c-0.272,1.042-1.009,2.349-1.5,3.146C10.4,23.863,11.193,24,12.02,24c6.617,0,11.987-5.37,11.987-11.987S18.637,0.192,12.02,0.192z"/>
          </svg>
        </a>
        
        {/* Email */}
        <a 
          href={emailUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-700 text-white p-2 rounded-full hover:bg-opacity-80 transition-opacity"
          aria-label="Share via Email"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22,3.999c0-0.65-0.45-1-1-1H3c-0.55,0-1,0.45-1,1v16c0,0.55,0.45,1,1,1h18c0.55,0,1-0.45,1-1V3.999z M20,3.999l-8,7l-8-7H20z M20,19.999H4v-14l8,7l8-7V19.999z"/>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default ShareButtons; 