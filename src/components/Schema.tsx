import React from 'react';

interface SchemaProps {
  type: 'Article' | 'FAQPage' | 'HowTo' | 'Product' | 'WebPage';
  data: Record<string, any>;
}

/**
 * Schema component for adding structured data markup
 * This helps search engines understand the content of the page
 * and can improve SEO by enabling rich results
 */
export default function Schema({
  data,
}: SchemaProps) {
  // Make sure this component only runs on the client side
  if (typeof window === 'undefined') {
    return null;
  }

  // Create the JSON-LD script that search engines will read
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data)
      }}
    />
  );
} 