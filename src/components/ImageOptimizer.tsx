'use client';

import React, { useState } from 'react';

type OptimizationOptions = {
  targetAge?: 'toddler' | 'child' | 'teen' | 'adult';
  targetPrinter?: 'standard' | 'highRes';
  enhanceContrast?: boolean;
  lineThicknessPreference?: 'thin' | 'medium' | 'thick';
};

interface ImageOptimizerProps {
  imageUrl: string;
  onOptimizationComplete: (optimizedImageUrl: string, metrics: any) => void;
}

export const ImageOptimizer: React.FC<ImageOptimizerProps> = ({
  imageUrl,
  onOptimizationComplete
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<OptimizationOptions>({
    targetAge: 'child',
    targetPrinter: 'standard',
    enhanceContrast: true,
    lineThicknessPreference: 'medium',
  });
  const [metrics, setMetrics] = useState<any>(null);

  const handleOptionChange = (key: keyof OptimizationOptions, value: any) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          options,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to optimize image');
      }
      
      setMetrics(data.metrics);
      onOptimizationComplete(data.optimizedImageData, data.metrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to optimize image');
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Optimize Your Coloring Page</h3>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age Group Optimization
          </label>
          <div className="flex flex-wrap gap-2">
            {(['toddler', 'child', 'teen', 'adult'] as const).map((age) => (
              <button
                key={age}
                type="button"
                onClick={() => handleOptionChange('targetAge', age)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  options.targetAge === age
                    ? 'bg-blue-100 text-blue-800 border-blue-300 border'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {age.charAt(0).toUpperCase() + age.slice(1)}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Optimizes details and line thickness based on age group
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Line Thickness
          </label>
          <div className="flex flex-wrap gap-2">
            {(['thin', 'medium', 'thick'] as const).map((thickness) => (
              <button
                key={thickness}
                type="button"
                onClick={() => handleOptionChange('lineThicknessPreference', thickness)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  options.lineThicknessPreference === thickness
                    ? 'bg-blue-100 text-blue-800 border-blue-300 border'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {thickness.charAt(0).toUpperCase() + thickness.slice(1)}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Adjust line thickness for different coloring tools
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Printer Optimization
          </label>
          <div className="flex flex-wrap gap-2">
            {(['standard', 'highRes'] as const).map((printer) => (
              <button
                key={printer}
                type="button"
                onClick={() => handleOptionChange('targetPrinter', printer)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  options.targetPrinter === printer
                    ? 'bg-blue-100 text-blue-800 border-blue-300 border'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {printer === 'standard' ? 'Standard Printer' : 'High Resolution'}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Optimizes for different printer resolutions
          </p>
        </div>
        
        <div className="flex items-center">
          <input
            id="enhanceContrast"
            type="checkbox"
            checked={options.enhanceContrast}
            onChange={(e) => handleOptionChange('enhanceContrast', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="enhanceContrast" className="ml-2 block text-sm text-gray-700">
            Enhance contrast for better printing
          </label>
        </div>
      </div>
      
      <button
        onClick={handleOptimize}
        disabled={isOptimizing}
        className={`w-full px-4 py-2 rounded-md font-medium text-white ${
          isOptimizing ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isOptimizing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Optimizing...
          </span>
        ) : (
          'Optimize Coloring Page'
        )}
      </button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {metrics && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h4 className="font-medium text-gray-700 mb-2">Quality Metrics</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Line Smoothness:</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${metrics.lineSmoothnessScore * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Line Consistency:</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${metrics.consistencyScore * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Composition:</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${metrics.compositionScore * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Printability:</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${metrics.printabilityScore * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-200 mt-2">
              <div className="flex items-center justify-between font-medium">
                <span className="text-sm text-gray-700">Overall Quality:</span>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  {Math.round(metrics.overallQuality * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 