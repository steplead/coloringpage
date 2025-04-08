'use client';

import React, { useState } from 'react';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import TranslatedText from './TranslatedText';

interface PDFDownloadProps {
  imageUrl: string;
  title: string;
  lang?: string;
}

export default function PDFDownload({ imageUrl, title, lang = 'en' }: PDFDownloadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create a sanitized filename
      const sanitizedTitle = title
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase()
        .substring(0, 50);
      
      const filename = `coloring_page_${sanitizedTitle}.pdf`;
      
      // Call the PDF generation API
      const response = await fetch('/api/pdf-export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          title,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}: Failed to generate PDF`);
      }
      
      // Get the PDF as a blob
      const blob = await response.blob();
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (err) {
      console.error('PDF download error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate PDF');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          isLoading 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <TranslatedText translationKey="download.generating" fallback="Generating PDF..." lang={lang} />
          </>
        ) : (
          <>
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            <TranslatedText translationKey="download.pdfButton" fallback="Download as PDF" lang={lang} />
          </>
        )}
      </button>
      
      {error && (
        <div className="mt-2 text-sm text-red-600">
          <TranslatedText 
            translationKey="download.error" 
            fallback={`Error: ${error}`} 
            lang={lang} 
          />
        </div>
      )}
      
      <div className="mt-2 text-xs text-gray-500">
        <TranslatedText 
          translationKey="download.pdfNote" 
          fallback="PDF includes a high-quality version perfect for printing" 
          lang={lang} 
        />
      </div>
    </div>
  );
} 