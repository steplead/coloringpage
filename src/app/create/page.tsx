'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import Image from 'next/image';

export default function CreatePage() {
  const [description, setDescription] = useState('');
  const [complexity, setComplexity] = useState('medium');
  const [style, setStyle] = useState('standard');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationPrompt, setGenerationPrompt] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [lastGeneratedDescription, setLastGeneratedDescription] = useState('');

  // Update character count
  useEffect(() => {
    setCharCount(description.length);
  }, [description]);

  // Reset error when user starts typing
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [description, complexity, style]);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);
    // Auto-expand textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (description.trim().length < 3) {
      setError('Please provide a more detailed description (at least 3 characters)');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setLastGeneratedDescription(description);
    setPreviewMode(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          complexity,
          style,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setGeneratedImage(data.imageUrl);
      setGenerationPrompt(data.prompt);
      // Smooth scroll to the generated image
      const imageElement = document.getElementById('generated-image');
      if (imageElement) {
        imageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Generation error:', err);
    } finally {
      setIsLoading(false);
      setPreviewMode(false);
    }
  };

  const handleTryAgain = () => {
    setGeneratedImage(null);
    setError(null);
    const textArea = document.getElementById('description') as HTMLTextAreaElement;
    if (textArea) {
      textArea.focus();
    }
  };

  return (
    <div className="w-full py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Create Your Coloring Page
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Describe what you want your coloring page to look like, and our AI will generate it for you!
          </p>
        </div>

        {/* Generated image display - Now at the top */}
        {(generatedImage || previewMode) && (
          <div id="generated-image" className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 transition-all duration-300">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {previewMode ? 'Generating Your Coloring Page...' : 'Your Coloring Page'}
              </h2>
              <p className="text-gray-600 text-sm">
                {previewMode ? 'Please wait while we create your design' : `Based on: "${lastGeneratedDescription}"`}
              </p>
            </div>
            <div className="flex flex-col items-center p-6">
              <div className="relative w-full max-w-lg aspect-square bg-gray-50 mb-6 border border-gray-200 rounded-lg overflow-hidden">
                {previewMode ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center">
                      <svg className="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="mt-4 text-blue-600 font-medium">Creating your design...</p>
                    </div>
                  </div>
                ) : generatedImage && (
                  <div className="w-full h-full">
                    <img 
                      src={generatedImage} 
                      alt="Generated coloring page" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
              {generatedImage && !previewMode && (
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                  <a 
                    href={generatedImage} 
                    download="coloring-page.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded shadow-sm transition-colors duration-200 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download
                  </a>
                  <button
                    onClick={() => window.print()}
                    className="bg-white border border-blue-300 hover:bg-blue-50 text-blue-600 font-medium py-2 px-6 rounded shadow-sm transition-colors duration-200 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                    </svg>
                    Print
                  </button>
                  <button
                    onClick={handleTryAgain}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded shadow-sm transition-colors duration-200 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Try Another
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-800 rounded-lg p-4 mb-8 animate-fade-in">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Generation Form */}
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 mb-8">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
                <span className="ml-2 text-gray-500 text-xs">
                  ({charCount} characters)
                </span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={description}
                onChange={handleDescriptionChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none min-h-[80px]"
                placeholder="Describe what you want in your coloring page (e.g., 'A magical castle with a dragon flying overhead')"
              />
              <p className="mt-2 text-sm text-gray-500 flex items-center justify-between">
                <span>Be as specific as possible for the best results.</span>
                <span className="text-gray-400">{charCount > 0 ? `${charCount} characters` : 'Start typing...'}</span>
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <fieldset>
                  <legend className="block text-sm font-medium text-gray-700 mb-2">
                    Complexity Level
                  </legend>
                  <div className="space-y-3">
                    {['Simple', 'Medium', 'Detailed'].map((level) => (
                      <div key={level} className="flex items-center">
                        <input
                          type="radio"
                          id={level.toLowerCase()}
                          name="complexity"
                          value={level.toLowerCase()}
                          checked={complexity === level.toLowerCase()}
                          onChange={() => setComplexity(level.toLowerCase())}
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <label htmlFor={level.toLowerCase()} className="ml-3 block text-sm text-gray-700 cursor-pointer">
                          {level}
                          <span className="text-gray-500 text-xs ml-2">
                            {level === 'Simple' && '(Good for young children)'}
                            {level === 'Medium' && '(Standard option)'}
                            {level === 'Detailed' && '(More intricate designs)'}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
              
              <div>
                <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-2">
                  Style
                </label>
                <select
                  id="style"
                  name="style"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value="standard">Standard</option>
                  <option value="cartoon">Cartoon</option>
                  <option value="realistic">Realistic</option>
                  <option value="abstract">Abstract</option>
                  <option value="geometric">Geometric</option>
                </select>
                <p className="mt-2 text-sm text-gray-500">
                  Choose the artistic style for your coloring page.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isLoading || !description.trim()}
                className={`${
                  isLoading || !description.trim() 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-medium py-3 px-8 rounded-md shadow-sm transition-all duration-200 text-lg flex items-center transform hover:scale-105 active:scale-95 disabled:hover:scale-100`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                    </svg>
                    Generate Coloring Page
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="bg-blue-50 rounded-lg p-8 border border-blue-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">Tips for Great Results</h3>
              <ul className="mt-4 space-y-3 text-gray-700">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Be specific in your description (e.g., "A cute cat playing with yarn" instead of just "Cat")
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  For complex scenes, choose the "Detailed" complexity level
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  For younger children, "Simple" complexity creates easier-to-color pages
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 