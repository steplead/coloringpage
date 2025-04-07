'use client';

import React, { useState } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  PinterestShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  PinterestIcon,
  EmailIcon,
} from 'react-share';
import { LinkIcon, CheckIcon } from '@heroicons/react/24/outline';
import TranslatedText from './TranslatedText';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  imageUrl: string;
  description?: string;
  className?: string;
  lang?: string;
}

export default function SocialShareButtons({
  url,
  title,
  imageUrl,
  description = 'Check out this coloring page I found!',
  className = '',
  lang = 'en',
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <FacebookShareButton url={url} hashtag="#coloringpage">
        <FacebookIcon size={36} round />
      </FacebookShareButton>

      <TwitterShareButton url={url} title={`${title} - ${description}`}>
        <TwitterIcon size={36} round />
      </TwitterShareButton>

      <WhatsappShareButton url={url} title={`${title} - ${description}`}>
        <WhatsappIcon size={36} round />
      </WhatsappShareButton>

      <PinterestShareButton url={url} media={imageUrl} description={`${title} - ${description}`}>
        <PinterestIcon size={36} round />
      </PinterestShareButton>

      <EmailShareButton url={url} subject={title} body={description}>
        <EmailIcon size={36} round />
      </EmailShareButton>

      <button
        onClick={handleCopyLink}
        className="inline-flex items-center justify-center w-9 h-9 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
        title={
          copied
            ? 'Link copied!'
            : 'Copy link'
        }
      >
        {copied ? (
          <CheckIcon className="w-5 h-5 text-green-600" />
        ) : (
          <LinkIcon className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {copied && (
        <span className="text-sm text-green-600 font-medium ml-2">
          <TranslatedText
            translationKey="common.linkCopied"
            fallback="Link copied!"
            lang={lang}
          />
        </span>
      )}
    </div>
  );
} 