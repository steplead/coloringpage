'use client';

import React, { useState, useEffect } from 'react';
import { StyleSelector } from './StyleSelector';
import { ExamplePrompts, PROMPT_CATEGORIES } from './ExamplePrompts';

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

const MAX_RETRIES = 3;

export const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [complexity, setComplexity] = useState<'simple' | 'medium' | 'complex'>('medium');
  const [selectedStyle, setSelectedStyle] = useState('classic');
  const [generationHistory, setGenerationHistory] = useState<{
    prompt: string;
    imageUrl: string;
    style: string;
    complexity: string;
  }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

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

  const handleSelectCategory = (categoryName: string | null) => {
    setSelectedCategory(categoryName);
  };

  const handleSelectPrompt = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const handleStyleChange = (styleId: string) => {
    setSelectedStyle(styleId);
  };

  const handleComplexityChange = (level: 'simple' | 'medium' | 'complex') => {
    setComplexity(level);
  };

  const handleRandomPrompt = () => {
    // Select a random category
    const categories = ['Animals', 'Vehicles', 'Fantasy', 'Nature', 'Characters', 'Holidays'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    setSelectedCategory(randomCategory);
    
    // Get examples from that category
    const categoryData = PROMPT_CATEGORIES.find(c => c.name === randomCategory);
    if (categoryData && categoryData.examples.length > 0) {
      const randomExample = categoryData.examples[Math.floor(Math.random() * categoryData.examples.length)];
      setPrompt(randomExample);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a description');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Add retry logic
    let retryCount = 0;
    let success = false;
    
    while (retryCount < MAX_RETRIES && !success) {
      try {
        if (retryCount > 0) {
          console.log(`Retry attempt ${retryCount}...`);
        }
        
        console.log('Sending request to generate image with prompt:', prompt);
        console.log('Style:', selectedStyle);
        console.log('Complexity:', complexity);
        
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            description: prompt,
            complexity,
            style: selectedStyle
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
        
        // Add to history (limit to last 20 items)
        setGenerationHistory(prev => {
          const newHistory = [{ 
            prompt: prompt, 
            imageUrl: data.imageUrl,
            style: selectedStyle,
            complexity: complexity
          }, ...prev].slice(0, 20);
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

  const loadFromHistory = (item: { prompt: string; imageUrl: string; style: string; complexity: string }) => {
    setPrompt(item.prompt);
    setSelectedStyle(item.style || 'classic');
    setComplexity(item.complexity as any || 'medium');
    setImage(item.imageUrl);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-lg font-medium text-gray-700 mb-2">
            Describe what you want to color
          </label>
          <div className="flex">
            <textarea
              id="prompt"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: A cute cat playing with yarn"
            />
            <button
              type="button"
              className="ml-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
              onClick={handleRandomPrompt}
              title="Generate random prompt"
            >
              🎲
            </button>
          </div>
        </div>

        {/* Style Selector Component */}
        <StyleSelector 
          selectedStyle={selectedStyle} 
          onSelectStyle={handleStyleChange} 
        />

        {/* Complexity Selector */}
        <div className="mb-6">
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
          <p className="text-sm text-gray-500 mt-1">
            {COMPLEXITY_LEVELS.find(level => level.id === complexity)?.description}
          </p>
        </div>

        {/* Example Prompts Component */}
        <ExamplePrompts
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          onSelectPrompt={handleSelectPrompt}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md font-medium text-white ${
            loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Generating...' : 'Generate Coloring Page'}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </form>

      {image && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Your Coloring Page</h2>
          <div className="mb-4 border p-2 rounded-lg">
            <img
              src={image}
              alt="Generated coloring page"
              className="w-full object-contain"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md"
            >
              Download
            </button>
            <button
              onClick={() => setImage(null)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md"
            >
              New Generation
            </button>
          </div>
        </div>
      )}

      {/* Generation History */}
      {generationHistory.length > 0 && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Generation History</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md"
              >
                {showHistory ? 'Hide' : 'Show'}
              </button>
              <button
                onClick={handleClearHistory}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md"
              >
                Clear
              </button>
            </div>
          </div>
          
          {showHistory && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {generationHistory.map((item, index) => (
                <div key={index} className="border rounded-lg overflow-hidden cursor-pointer" onClick={() => loadFromHistory(item)}>
                  <img
                    src={item.imageUrl}
                    alt={item.prompt}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-2 bg-gray-50">
                    <p className="text-sm truncate" title={item.prompt}>
                      {item.prompt}
                    </p>
                    <div className="flex mt-1 text-xs text-gray-500">
                      <span className="mr-2">{item.style}</span>
                      <span>{item.complexity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 