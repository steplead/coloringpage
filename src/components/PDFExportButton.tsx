'use client';

import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface PDFExportButtonProps {
  imageUrl: string;
  title?: string;
  className?: string;
}

export default function PDFExportButton({ 
  imageUrl, 
  title = 'Coloring Page',
  className = ''
}: PDFExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  // Paper size options
  const paperSizes = [
    { id: 'a4', name: 'A4', width: 210, height: 297 },
    { id: 'letter', name: 'Letter', width: 215.9, height: 279.4 },
    { id: 'a5', name: 'A5', width: 148, height: 210 },
    { id: 'a3', name: 'A3', width: 297, height: 420 }
  ];

  // Handle PDF generation and download
  const handleExportPDF = async (paperSize: typeof paperSizes[0]) => {
    try {
      setIsLoading(true);
      setShowOptions(false);
      
      // Create a new PDF with the selected paper size (in mm)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [paperSize.width, paperSize.height]
      });
      
      // Load the image
      const img = new Image();
      img.crossOrigin = 'Anonymous'; // Handle CORS issues
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });
      
      // Get image dimensions
      const imgWidth = img.width;
      const imgHeight = img.height;
      
      // Calculate sizing to fit the page with margins
      const pageWidth = paperSize.width - 20; // 10mm margins on each side
      const pageHeight = paperSize.height - 20; // 10mm margins on top and bottom
      
      // Calculate scaling factor while maintaining aspect ratio
      const scale = Math.min(
        pageWidth / imgWidth,
        pageHeight / imgHeight
      );
      
      // Calculate dimensions of the scaled image
      const scaledWidth = imgWidth * scale;
      const scaledHeight = imgHeight * scale;
      
      // Calculate centering position
      const x = (paperSize.width - scaledWidth) / 2;
      const y = (paperSize.height - scaledHeight) / 2;
      
      // Add title
      pdf.setFontSize(16);
      pdf.text(title, paperSize.width / 2, 10, { align: 'center' });
      
      // Add the image
      pdf.addImage(
        img,
        'PNG',
        x,
        y,
        scaledWidth,
        scaledHeight
      );
      
      // Add footer with attribution
      pdf.setFontSize(8);
      const footerText = `Generated with AI Coloring Page Generator • ai-coloringpage.com`;
      pdf.text(footerText, paperSize.width / 2, paperSize.height - 5, { align: 'center' });
      
      // Save the PDF
      pdf.save(`${title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className={`flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors ${className} ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
          </svg>
        )}
        Export as PDF
      </button>
      
      {showOptions && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-md shadow-lg p-3 z-50 min-w-[200px] border border-gray-200">
          <div className="flex items-center mb-2">
            <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-1" />
            <span className="text-sm text-gray-600">Choose paper size:</span>
          </div>
          
          <div className="space-y-2">
            {paperSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => handleExportPDF(size)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                {size.name} ({size.width}mm × {size.height}mm)
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 