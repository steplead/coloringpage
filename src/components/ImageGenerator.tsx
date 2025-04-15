'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import TranslatedText from '@/components/TranslatedText';

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
      } catch /* removed unused e */ {
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
            category: selectedCategory ? selectedCategory.toLowerCase() : 'default'
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
        
        // 图片已在API端自动保存到Gallery
        if (data.savedToGallery) {
          console.log('Image was automatically saved to gallery');
        } else {
          console.log('Note: Image was not automatically saved to gallery');
        }
        
        // 添加到历史记录(限制为最后10项)
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
      {/* Left column - Form */}
      <div className="md:col-span-7 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Category Selection */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Choose a Category 
                <span className="ml-1 text-sm font-normal text-gray-500">(Helps the AI understand what you want)</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {CATEGORIES.map(category => (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => handleSelectCategory(category.name)}
                    className={`p-2 rounded-lg text-center transition-colors flex flex-col items-center justify-center ${
                      selectedCategory === category.name
                        ? 'bg-blue-100 text-blue-800 border-blue-300 border'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-transparent'
                    }`}
                  >
                    <span className="text-2xl mb-1">{category.icon}</span>
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div className="mb-6">
              <label htmlFor="prompt" className="block text-lg font-medium text-gray-700 mb-2">
                Describe Your Coloring Page
                <span className="ml-2 text-sm font-normal text-blue-600">Be specific for better results!</span>
              </label>
              <div className="relative">
                <textarea
                  id="prompt"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'A friendly panda eating bamboo' or 'A castle with a dragon flying overhead'"
                  disabled={isAdvancedMode || loading}
                />
                <div className="absolute inset-y-0 right-0 flex items-start pr-3 pt-2 pointer-events-none">
                  <span className={`text-xs ${prompt.length > 200 ? 'text-red-500' : 'text-gray-400'}`}>
                    {prompt.length}/200
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-gray-600">
                  Add specific details like colors, objects, and setting. Example: "A happy cartoon elephant playing with a ball in a sunny park"
                </p>
              </div>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Ideas (click to use):</h3>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-800"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Style Selection */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Complexity Level
                <span className="ml-1 text-sm font-normal text-gray-500">(Choose based on age group)</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {STYLE_OPTIONS.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleStyleChange(option.id)}
                    className={`p-2 rounded-lg text-center transition-colors border ${
                      style === option.id
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-transparent'
                    }`}
                  >
                    <div className="text-2xl mb-1">{option.icon}</div>
                    <div className="text-sm font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500 mt-1 hidden sm:block">{option.description}</div>
                  </button>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-600 flex items-center">
                <span className="mr-1">🧒</span> Simple: Ages 2-5 | 
                <span className="mx-1">👧</span> Medium: Ages 6-12 | 
                <span className="mx-1">👨</span> Complex/Realistic: Ages 12+
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Style affects image complexity and appearance. &quot;Medium&quot; is recommended for general use.
              </p>
            </div>

            {/* Advanced Toggle */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center">
                <label htmlFor="advanced-mode" className="mr-2 font-medium text-gray-700">Expert Mode:</label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    id="advanced-mode"
                    type="checkbox"
                    checked={isAdvancedMode}
                    onChange={toggleAdvancedMode}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="advanced-mode"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                For precise control over the AI prompt
              </div>
            </div>

            {isAdvancedMode ? (
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
                    <TranslatedText translationKey="advancedPromptTip1" />
                    &quot;<TranslatedText translationKey="advancedPromptTip2" />&quot;.
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  <TranslatedText translationKey="advancedPromptTip3" />
                </p>
              </>
            ) : (
              <>
                {/* Standard Mode UI */}
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

                <p className="text-xs text-gray-500 italic mt-1">
                  <TranslatedText translationKey="customPromptInfo" />
                  (<TranslatedText translationKey="example" />: &quot;a cute cat&quot;, &quot;a detailed spaceship&quot;)
                </p>
              </>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 md:py-4 px-4 rounded-md text-white font-medium transition-colors duration-200 touch-manipulation ${
                  loading
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Your Coloring Page...
                  </span>
                ) : (
                  'Generate Coloring Page'
                )}
              </button>
              <p className="mt-2 text-xs text-center text-gray-500">Generation takes approximately 5-10 seconds</p>
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
      <div className="md:col-span-5">
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
              <div className="w-full flex flex-col items-center">
                <p className="text-sm text-gray-600 mb-2">Generated for: &quot;{lastGeneratedPrompt}&quot;</p>
                <div className="w-full aspect-square bg-gray-100 rounded overflow-hidden border border-gray-200 mb-4">
                  <Image
                    src={image}
                    alt={prompt || 'Generated coloring page'}
                    fill
                    className="object-contain"
                    priority={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={90}
                  />
                </div>
              </div>
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
  );
}; 