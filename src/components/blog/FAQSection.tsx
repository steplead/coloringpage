'use client';

import React, { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  className?: string;
}

/**
 * FAQ Section component for blog posts
 * Displays accordions of frequently asked questions with answers
 * Great for SEO and user engagement
 */
const FAQSection: React.FC<FAQSectionProps> = ({ faqs, className = '' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className={`${className}`}>
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              className="flex justify-between items-center w-full p-4 text-left bg-white hover:bg-gray-50 transition-colors"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
              <svg 
                className={`h-5 w-5 text-gray-500 transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div 
              id={`faq-answer-${index}`}
              className={`prose max-w-none p-4 bg-gray-50 ${openIndex === index ? 'block' : 'hidden'}`}
              dangerouslySetInnerHTML={{ __html: faq.answer }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection; 