'use client';

import React, { useState, useEffect } from 'react';

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

// Complexity levels
const COMPLEXITY_LEVELS = [
  { id: 'simple', label: 'Simple', description: 'Fewer details, ideal for young children' },
  { id: 'medium', label: 'Medium', description: 'Balanced details, good for most ages' },
  { id: 'complex', label: 'Complex', description: 'More intricate details, better for older children and adults' },
];

// Style options
const STYLE_OPTIONS = [
  { id: 'standard', label: 'Standard', description: 'Classic coloring page style' },
  { id: 'cute', label: 'Cute', description: 'Adorable, kawaii style' },
  { id: 'cartoon', label: 'Cartoon', description: 'Animated cartoon style' },
  { id: 'realistic', label: 'Realistic', description: 'More realistic proportions and details' },
  { id: 'geometric', label: 'Geometric', description: 'Composed of geometric shapes and patterns' },
  { id: 'sketch', label: 'Sketch', description: 'Hand-drawn sketch appearance' },
];

const MAX_RETRIES = 3;
const BASE_PROMPT = 'black outline coloring page, clean lines';

export const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [complexity, setComplexity] = useState<'simple' | 'medium' | 'complex'>('medium');
  const [style, setStyle] = useState<string>('standard');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [lastGeneratedPrompt, setLastGeneratedPrompt] = useState<string>('');
  const [generationHistory, setGenerationHistory] = useState<{prompt: string, imageUrl: string}[]>([]);
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

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

  // Update custom prompt when toggling advanced mode
  useEffect(() => {
    if (advancedMode) {
      // Create a starting point for the custom prompt
      let initialCustomPrompt = prompt;
      
      // Add style if it's not standard
      if (style !== 'standard') {
        const selectedStyle = STYLE_OPTIONS.find(s => s.id === style);
        if (selectedStyle) {
          initialCustomPrompt += `, ${selectedStyle.description.toLowerCase()}`;
        }
      }
      
      // Add complexity
      const selectedComplexity = COMPLEXITY_LEVELS.find(c => c.id === complexity);
      if (selectedComplexity) {
        initialCustomPrompt += `, ${selectedComplexity.description.toLowerCase()}`;
      }
      
      // Add base prompt
      initialCustomPrompt += `, ${BASE_PROMPT}`;
      
      setCustomPrompt(initialCustomPrompt);
    }
  }, [advancedMode, prompt, style, complexity]);

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const handleComplexityChange = (level: 'simple' | 'medium' | 'complex') => {
    setComplexity(level);
  };

  const handleStyleChange = (newStyle: string) => {
    setStyle(newStyle);
  };

  const toggleAdvancedMode = () => {
    setAdvancedMode(!advancedMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (advancedMode) {
      if (!customPrompt.trim()) {
        setError('Please enter a custom prompt');
        return;
      }
    } else if (!prompt.trim()) {
      setError('Please enter a description');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Store what was generated for display
    setLastGeneratedPrompt(advancedMode ? customPrompt : prompt);
    
    // Add retry logic
    let retryCount = 0;
    let success = false;
    
    while (retryCount < MAX_RETRIES && !success) {
      try {
        if (retryCount > 0) {
          console.log(`Retry attempt ${retryCount}...`);
        }
        
        console.log('Sending request to generate image with parameters:', {
          description: prompt,
          advancedMode,
          customPrompt: advancedMode ? customPrompt : undefined,
          complexity,
          style
        });
        
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            description: prompt,
            complexity,
            style,
            advancedMode,
            customPrompt: advancedMode ? customPrompt : undefined,
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
        
        // If the API returned the full prompt, use it
        if (data.prompt) {
          setLastGeneratedPrompt(data.prompt);
        }
        
        // Add to history (limit to last 10 items)
        setGenerationHistory(prev => {
          const newHistory = [{ 
            prompt: advancedMode ? customPrompt : prompt, 
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
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Create Your Coloring Page</h2>
          <div className="flex items-center">
            <label className="inline-flex items-center mr-2 text-sm text-gray-700">
              <span className={advancedMode ? "font-bold text-blue-600" : ""}>Advanced Mode</span>
            </label>
            <div
              onClick={toggleAdvancedMode}
              className={`relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full ${
                advancedMode ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 transition duration-100 ease-in-out rounded-full transform ${
                  advancedMode ? "translate-x-6" : ""
                }`}
              ></div>
            </div>
            <div 
              className="ml-2 text-gray-500 cursor-help"
              onMouseEnter={() => setShowTooltip('advanced')}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {showTooltip === 'advanced' && (
                <div className="absolute z-10 w-64 p-2 mt-1 text-sm text-white bg-gray-800 rounded shadow-lg">
                  Advanced Mode gives you complete control over the prompt. 
                  Use this if you want to craft a specific instruction for the AI.
                </div>
              )}
            </div>
          </div>
        </div>

        {!advancedMode ? (
          <>
            <div className="mb-4">
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

            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Style
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {STYLE_OPTIONS.map((styleOption) => (
                  <button
                    key={styleOption.id}
                    type="button"
                    className={`p-3 rounded-md text-center ${
                      style === styleOption.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleStyleChange(styleOption.id)}
                  >
                    <div className="text-sm font-medium">{styleOption.label}</div>
                    <div className="text-xs mt-1">{styleOption.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Complexity Level
              </label>
              <div className="flex gap-4">
                {COMPLEXITY_LEVELS.map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    className={`px-4 py-2 rounded-md ${
                      complexity === level.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleComplexityChange(level.id as 'simple' | 'medium' | 'complex')}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.name}
                    type="button"
                    className={`p-4 rounded-lg text-center ${
                      selectedCategory === category.name
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleSelectCategory(category.name)}
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="text-sm">{category.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {suggestions.length > 0 && (
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Suggestions
                </label>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
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
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="customPrompt" className="block text-lg font-medium text-gray-700">
                Custom Prompt (Advanced)
              </label>
              <div 
                className="text-gray-500 cursor-help"
                onMouseEnter={() => setShowTooltip('customPrompt')}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                {showTooltip === 'customPrompt' && (
                  <div className="absolute z-10 w-72 p-2 mt-1 text-sm text-white bg-gray-800 rounded shadow-lg">
                    For best coloring pages, include "black outline coloring page, clean lines" 
                    in your custom prompt.
                  </div>
                )}
              </div>
            </div>
            <textarea
              id="customPrompt"
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enter your complete custom prompt. For best results, include 'black outline coloring page, clean lines'"
            />
            <p className="mt-2 text-sm text-gray-500">
              Your prompt will be sent directly to the AI model without modifications.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md text-white font-medium ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Generating...' : 'Generate Coloring Page'}
        </button>
      </form>

      {error && (
        <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {image && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Your Coloring Page
          </h2>
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              Based on: "{lastGeneratedPrompt}"
            </p>
          </div>
          <div className="mb-4">
            <img
              src={image}
              alt="Generated coloring page"
              className="w-full max-w-2xl mx-auto"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Download
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Print
            </button>
          </div>
        </div>
      )}

      {generationHistory.length > 0 && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-700">
              Recent Generations
            </h2>
            <button
              onClick={handleClearHistory}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear History
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {generationHistory.map((item, index) => (
              <div key={index} className="relative group">
                <img
                  src={item.imageUrl}
                  alt={item.prompt}
                  className="w-full rounded-md"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.prompt}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 