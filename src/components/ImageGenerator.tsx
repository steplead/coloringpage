'use client';

import React, { useState, useEffect } from 'react';
import { getSuggestedPromptEnhancements } from '@/lib/imageProcessing';
import { ImageOptimizer } from './ImageOptimizer';

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

export const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [optimizedImage, setOptimizedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationData, setGenerationData] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [complexity, setComplexity] = useState<'simple' | 'medium' | 'complex'>('medium');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [lastGeneratedPrompt, setLastGeneratedPrompt] = useState<string>('');
  const [generationHistory, setGenerationHistory] = useState<{prompt: string, imageUrl: string}[]>([]);
  const [promptEnhancements, setPromptEnhancements] = useState<string[]>([]);
  const [showOptimizer, setShowOptimizer] = useState<boolean>(false);
  const [qualityMetrics, setQualityMetrics] = useState<any>(null);
  
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
        setPromptEnhancements(getSuggestedPromptEnhancements(selectedCategory));
      }
    } else {
      setSuggestions([]);
      setPromptEnhancements([]);
    }
  }, [selectedCategory]);

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const handleComplexityChange = (level: 'simple' | 'medium' | 'complex') => {
    setComplexity(level);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset optimized image when generating a new one
    setOptimizedImage(null);
    setShowOptimizer(false);
    setQualityMetrics(null);
    
    if (!prompt.trim()) {
      setError('Please enter a description');
      return;
    }
    
    setLoading(true);
    setError(null);
    setLastGeneratedPrompt(prompt);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt,
          category: selectedCategory || '',
          complexity
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }
      
      setImage(data.imageUrl);
      setGenerationData(data);
      
      // Add to history (limit to last 10 items)
      setGenerationHistory(prev => {
        const newHistory = [{ prompt: prompt, imageUrl: data.imageUrl }, ...prev].slice(0, 10);
        return newHistory;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = () => {
    // If optimized image exists, download that instead of the original
    const imageToDownload = optimizedImage || image;
    
    if (imageToDownload) {
      const link = document.createElement('a');
      link.href = imageToDownload;
      link.download = `coloring-page-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOptimizationComplete = (optimizedImageUrl: string, metrics: any) => {
    setOptimizedImage(optimizedImageUrl);
    setQualityMetrics(metrics);
  };

  const handleToggleOptimizer = () => {
    setShowOptimizer(!showOptimizer);
  };

  const handleClearHistory = () => {
    setGenerationHistory([]);
    localStorage.removeItem('generationHistory');
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
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
            placeholder="E.g., 'a cat playing with yarn', 'a forest scene', 'a superhero'"
            required
          />
          <p className="mt-2 text-sm text-gray-500">
            Be specific for best results. The AI will create a black outline drawing based on your description.
          </p>
        </div>

        {/* Category Selection */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-2">Choose a category for inspiration:</h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.name}
                type="button"
                onClick={() => handleSelectCategory(category.name)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  selectedCategory === category.name
                    ? 'bg-blue-100 text-blue-800 border-blue-300 border'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Complexity Selection */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-2">Detail Level:</h3>
          <div className="flex flex-wrap gap-3">
            {COMPLEXITY_LEVELS.map((level) => (
              <div 
                key={level.id}
                className={`relative border rounded-lg p-3 cursor-pointer ${
                  complexity === level.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleComplexityChange(level.id as 'simple' | 'medium' | 'complex')}
              >
                <div className="flex items-center mb-1">
                  <div className={`w-4 h-4 rounded-full mr-2 ${
                    level.id === 'simple' ? 'bg-green-500' :
                    level.id === 'medium' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                  <span className="font-medium">{level.label}</span>
                </div>
                <p className="text-xs text-gray-500">{level.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-2">Suggestions:</h3>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-800 rounded-full text-sm font-medium"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Prompt Enhancements */}
        {promptEnhancements.length > 0 && (
          <div className="mb-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-700 mb-2">Tips for better results:</h3>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              {promptEnhancements.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex items-center">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-md font-medium text-white ${
              loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center">
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
          
          {image && (
            <button
              type="button"
              onClick={handleDownload}
              className="ml-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
            >
              Download
            </button>
          )}
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </form>
      
      {image && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="md:flex-1">
              <h2 className="text-2xl font-bold mb-4">Your Coloring Page</h2>
              
              <div className="border border-gray-300 rounded-lg p-4 bg-white inline-block mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={optimizedImage || image} 
                  alt={`Coloring page of ${lastGeneratedPrompt}`}
                  className="max-w-full h-auto"
                />
              </div>
              
              {generationData && (
                <div className="text-sm text-gray-600">
                  <p><span className="font-semibold">Your prompt:</span> {generationData.prompt}</p>
                  <p className="mt-1"><span className="font-semibold">Category:</span> {generationData.category}</p>
                  <p className="mt-1"><span className="font-semibold">Detail level:</span> {complexity}</p>
                  <p className="mt-1"><span className="font-semibold">Image seed:</span> {generationData.seed}</p>
                  
                  {qualityMetrics && (
                    <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                      <p className="text-green-700 font-medium">
                        Enhanced for quality (Score: {Math.round(qualityMetrics.overallQuality * 100)}%)
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {!showOptimizer && image && (
                <div className="mt-4">
                  <button
                    onClick={handleToggleOptimizer}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    Enhance Image Quality
                  </button>
                </div>
              )}
            </div>
            
            {showOptimizer && image && (
              <div className="md:w-80">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">Image Enhancement</h3>
                  <button
                    onClick={handleToggleOptimizer}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <ImageOptimizer
                  imageUrl={image}
                  onOptimizationComplete={handleOptimizationComplete}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Generation History */}
      {generationHistory.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Recent Creations</h2>
            <button 
              onClick={handleClearHistory}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Clear History
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {generationHistory.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                  <p className="text-sm text-gray-700 truncate">{item.prompt}</p>
                </div>
                <div className="p-2 flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.imageUrl} 
                    alt={`Coloring page of ${item.prompt}`} 
                    className="max-h-40 w-auto"
                  />
                </div>
                <div className="p-2 bg-gray-50 border-t border-gray-200 flex justify-center">
                  <a 
                    href={item.imageUrl} 
                    download={`coloring-page-${index}.png`}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 