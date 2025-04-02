'use client';

import React, { useState, useEffect } from 'react';

// Style options with visual examples
const STYLE_OPTIONS = [
  { id: 'simple', label: 'Simple', description: 'Fewer details, ideal for young children', icon: '🐢' },
  { id: 'medium', label: 'Medium', description: 'Balanced details, good for most ages', icon: '🦁' },
  { id: 'complex', label: 'Complex', description: 'More intricate details, better for older children and adults', icon: '🐉' },
  { id: 'cartoon', label: 'Cartoon', description: 'Fun cartoon style with bold lines', icon: '🚀' },
  { id: 'realistic', label: 'Realistic', description: 'More realistic shapes and proportions', icon: '🏰' },
];

// Prompt suggestion categories
const CATEGORIES = [
  { 
    name: 'Animals', 
    examples: ['Cute cat', 'Dolphin', 'Lion', 'Elephant', 'Butterfly', 'Dinosaur', 'Owl', 'Turtle'],
    icon: '🐾'
  },
  { 
    name: 'Nature', 
    examples: ['Tree', 'Flower', 'Mountain landscape', 'Beach scene', 'Forest', 'Garden', 'Waterfall'],
    icon: '🌿'
  },
  { 
    name: 'Fantasy', 
    examples: ['Dragon', 'Unicorn', 'Fairy', 'Castle', 'Wizard', 'Mermaid', 'Superhero'],
    icon: '✨'
  },
  { 
    name: 'Vehicles', 
    examples: ['Car', 'Rocket ship', 'Train', 'Airplane', 'Submarine', 'Tractor', 'Helicopter'],
    icon: '🚗'
  },
  { 
    name: 'Holidays', 
    examples: ['Christmas tree', 'Halloween pumpkin', 'Easter bunny', 'Valentine heart', 'Birthday cake'],
    icon: '🎄'
  },
  { 
    name: 'Patterns', 
    examples: ['Mandala', 'Geometric pattern', 'Floral design', 'Kaleidoscope', 'Abstract shapes'],
    icon: '🔄'
  }
];

// Base prompt that defines a coloring page
const BASE_PROMPT = 'black outline coloring page, clean lines';

const MAX_RETRIES = 3;

export const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [style, setStyle] = useState<string>('medium');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [lastGeneratedPrompt, setLastGeneratedPrompt] = useState<string>('');
  const [generationHistory, setGenerationHistory] = useState<{prompt: string, imageUrl: string}[]>([]);
  
  // New state for advanced mode
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(BASE_PROMPT);

  // Load generation history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('generationHistory');
    if (savedHistory) {
      try {
        setGenerationHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse generation history');
      }
    }
  }, []);

  // Save generation history to localStorage
  useEffect(() => {
    if (generationHistory.length > 0) {
      localStorage.setItem('generationHistory', JSON.stringify(generationHistory));
    }
  }, [generationHistory]);

  // Update suggestions when category changes
  useEffect(() => {
    if (selectedCategory) {
      const category = CATEGORIES.find(cat => cat.name === selectedCategory);
      if (category) {
        setSuggestions(category.examples);
      }
    } else {
      setSuggestions([]);
    }
  }, [selectedCategory]);

  // Reset custom prompt when toggling advanced mode
  useEffect(() => {
    if (isAdvancedMode) {
      // Prefill the custom prompt with a helpful starting point
      setCustomPrompt(`${prompt ? prompt + ', ' : ''}${BASE_PROMPT}`);
    }
  }, [isAdvancedMode, prompt]);

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const handleStyleChange = (selectedStyle: string) => {
    setStyle(selectedStyle);
  };

  const toggleAdvancedMode = () => {
    setIsAdvancedMode(!isAdvancedMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdvancedMode && !prompt.trim()) {
      setError('Please enter a description');
      return;
    }

    if (isAdvancedMode && !customPrompt.trim()) {
      setError('Please enter a custom prompt');
      return;
    }
    
    setLoading(true);
    setError(null);
    setLastGeneratedPrompt(isAdvancedMode ? customPrompt : prompt);
    
    // Add retry logic
    let retryCount = 0;
    let success = false;
    
    while (retryCount < MAX_RETRIES && !success) {
      try {
        if (retryCount > 0) {
          console.log(`Retry attempt ${retryCount}...`);
        }
        
        console.log('Sending request to generate image with prompt:', isAdvancedMode ? customPrompt : prompt);
        
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            description: prompt,
            style: style,
            isAdvancedMode: isAdvancedMode,
            customPrompt: customPrompt,
            category: selectedCategory ? selectedCategory.toLowerCase() as any : 'default'
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Generation error:', data);
          throw new Error(data.error || `API error: ${response.status}`);
        }
        
        if (!data.imageUrl) {
          console.error('Missing image URL in response:', data);
          throw new Error('Failed to get image URL from server');
        }
        
        console.log('Image generated successfully:', data.imageUrl);
        setImage(data.imageUrl);
        
        // Save the image to the gallery
        try {
          const galleryResponse = await fetch('/api/save-to-gallery', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              prompt: isAdvancedMode ? customPrompt : prompt,
              imageUrl: data.imageUrl,
              style: style,
              title: prompt.substring(0, 100) // Use the first 100 chars of prompt as title
            }),
          });
          
          if (!galleryResponse.ok) {
            console.error('Failed to save to gallery:', await galleryResponse.json());
          } else {
            console.log('Successfully saved to gallery');
          }
        } catch (error) {
          console.error('Error saving to gallery:', error);
        }
        
        // Add to history (limit to last 10 items)
        setGenerationHistory(prev => {
          const newHistory = [{ 
            prompt: isAdvancedMode ? customPrompt : prompt, 
            imageUrl: data.imageUrl 
          }, ...prev].slice(0, 10);
          return newHistory;
        });
        
        success = true;
      } catch (err) {
        console.error(`Error in image generation (attempt ${retryCount + 1}):`, err);
        
        if (retryCount === MAX_RETRIES - 1) {
          // Final attempt failed
          setError(err instanceof Error ? err.message : 'Failed to generate image');
        } else {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
          retryCount++;
        }
      }
    }
    
    setLoading(false);
  };
  
  const handleDownload = () => {
    if (image) {
      const link = document.createElement('a');
      link.href = image;
      link.download = `coloring-page-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleClearHistory = () => {
    setGenerationHistory([]);
    localStorage.removeItem('generationHistory');
  };

  return (
    <div className="w-full">
      {/* Two-column layout for desktop */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column - Input */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <form onSubmit={handleSubmit}>
              {/* Advanced Mode Toggle */}
              <div className="mb-6 flex items-center">
                <label htmlFor="advanced-mode" className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      id="advanced-mode" 
                      className="sr-only" 
                      checked={isAdvancedMode}
                      onChange={toggleAdvancedMode}
                    />
                    <div className={`block w-14 h-8 rounded-full transition ${isAdvancedMode ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${isAdvancedMode ? 'translate-x-6' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-gray-700 font-medium">
                    Advanced Mode {isAdvancedMode && <span className="text-xs ml-1">(for experienced users)</span>}
                  </div>
                </label>
              </div>

              {!isAdvancedMode ? (
                <>
                  {/* Standard Mode UI */}
                  <div className="mb-6">
                    <label htmlFor="prompt" className="block text-lg font-medium text-gray-700 mb-2">
                      Describe what you want to color
                    </label>
                    <textarea
                      id="prompt"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Example: A cute cat playing with yarn"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-700 mb-3">
                      Choose a Style
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {STYLE_OPTIONS.map((option) => (
                        <div
                          key={option.id}
                          className={`cursor-pointer rounded-md overflow-hidden transition-all hover:shadow-md ${
                            style === option.id
                              ? 'ring-2 ring-blue-500 shadow-md'
                              : 'border border-gray-200'
                          }`}
                          onClick={() => handleStyleChange(option.id)}
                        >
                          <div className="p-2 bg-gray-50 aspect-square flex items-center justify-center text-3xl">
                            {option.icon}
                          </div>
                          <div className="p-2 text-center bg-white">
                            <p className="font-medium text-sm">{option.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      {STYLE_OPTIONS.find(o => o.id === style)?.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-700 mb-3">
                      Categories
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {CATEGORIES.map((category) => (
                        <div
                          key={category.name}
                          className={`cursor-pointer rounded-md overflow-hidden p-3 transition-all flex items-center ${
                            selectedCategory === category.name
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => handleSelectCategory(category.name)}
                        >
                          <div className="text-2xl mr-2">{category.icon}</div>
                          <div className="text-sm font-medium">{category.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {suggestions.length > 0 && (
                    <div className="mb-6">
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        Suggestions
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                            onClick={() => handleSelectSuggestion(suggestion)}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Advanced Mode UI */}
                  <div className="mb-6">
                    <label htmlFor="custom-prompt" className="block text-lg font-medium text-gray-700 mb-2">
                      Custom Prompt (Complete Control)
                    </label>
                    <textarea
                      id="custom-prompt"
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Enter your complete prompt with all details..."
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      For best coloring pages, include &quot;black outline coloring page, clean lines&quot;
                    </p>
                  </div>
                </>
              )}

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-md font-medium text-white ${
                    loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors shadow-md`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    'Generate Coloring Page'
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right column - Preview/Result */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white p-6 rounded-xl shadow-md h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4">
              {loading ? 'Generating Your Coloring Page...' : image ? 'Your Coloring Page' : 'Preview'}
            </h2>
            
            <div className="flex-grow flex items-center justify-center bg-gray-50 rounded-lg p-4 mb-4">
              {loading ? (
                <div className="text-center">
                  <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="mt-4 text-blue-800">Creating your masterpiece...</p>
                </div>
              ) : image ? (
                <img 
                  src={image} 
                  alt="Generated coloring page" 
                  className="max-w-full max-h-[500px] object-contain rounded-md"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>Your coloring page will appear here</p>
                  <p className="text-sm mt-2">Fill out the form and click "Generate" to create a coloring page</p>
                </div>
              )}
            </div>

            {image && (
              <div className="mt-auto">
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => window.open(image, '_blank')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Open in New Tab
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Print
                  </button>
                </div>
                <p className="mt-4 text-sm text-gray-500 text-center">
                  Prompt: {lastGeneratedPrompt}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History Section */}
      {generationHistory.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recently Generated</h2>
            <button
              onClick={handleClearHistory}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Clear History
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {generationHistory.map((item, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.open(item.imageUrl, '_blank')}>
                <div className="aspect-square bg-gray-50 p-2">
                  <img
                    src={item.imageUrl}
                    alt={`Generated coloring page ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-500 truncate" title={item.prompt}>
                    {item.prompt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 