import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Render Effects Component
 * Provides AI-powered visual effects for coloring pages
 */
const RenderEffects = ({
  onApplyEffect = () => {},
  isProcessing = false,
  className = ''
}) => {
  const [selectedEffect, setSelectedEffect] = useState('enhance');
  const [effectIntensity, setEffectIntensity] = useState(60);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [customParameters, setCustomParameters] = useState({
    colorBalance: 50,
    lightness: 50,
    saturation: 50,
    contrast: 50
  });
  
  // Available AI effects
  const effects = [
    {
      id: 'enhance',
      name: 'Color Enhance',
      description: 'Enhance colors and details in your artwork',
      type: 'visual',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m2 12 5.25 5c.073.072.195.166.27.22a.988.988 0 0 0 1.12-.2.987.987 0 0 0 .2-1.091C8.777 15.853 8.7 15.75 8.633 15.7L4 12l4.633-3.7c.067-.05.144-.153.207-.229a.987.987 0 0 0-.2-1.091.988.988 0 0 0-1.12-.2c-.075.054-.197.148-.27.22L2 12ZM22 12l-5.25 5c-.073.072-.195.166-.27.22a.988.988 0 0 1-1.12-.2.987.987 0 0 1-.2-1.091c.063-.076.144-.179.207-.229L20 12l-4.633-3.7c-.063-.05-.144-.153-.207-.229a.987.987 0 0 1 .2-1.091.988.988 0 0 1 1.12-.2c.075.054.197.148.27.22L22 12Z"/>
          <path d="m7 4 10 16"/>
        </svg>
      )
    },
    {
      id: 'sharpen',
      name: 'Sharpen Details',
      description: 'Sharpen fine details in the artwork',
      type: 'visual',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/>
          <path d="m14 7 3 3"/>
          <path d="M5 6v4"/>
          <path d="M19 14v4"/>
          <path d="M10 2v2"/>
          <path d="M7 8H3"/>
          <path d="M21 16h-4"/>
          <path d="M11 3H9"/>
        </svg>
      )
    },
    {
      id: 'vintage',
      name: 'Vintage Look',
      description: 'Apply a retro style to the coloring',
      type: 'style',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
      )
    },
    {
      id: 'watercolor',
      name: 'Watercolor',
      description: 'Soft watercolor effect for a painted look',
      type: 'style',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 2v1c0 1 2 1 2 2S3 6 3 7s2 1 2 2-2 1-2 2 2 1 2 2"/>
          <path d="M18 6V5c0-1 2-1 2-2s-2-1-2-2"/>
          <path d="M21 8v1c0 1-2 1-2 2s2 1 2 2"/>
          <path d="M19 16v3c0 1-2 1-2 2s2 1 2 2"/>
          <path d="M11 16c0-1 2-1 2-2s-2-1-2-2 2-1 2-2-2-1-2-2 2-1 2-2"/>
        </svg>
      )
    },
    {
      id: 'cartoon',
      name: 'Cartoon Style',
      description: 'Apply cartoon-like effects to your artwork',
      type: 'style',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/>
          <path d="M8 21v1"/>
          <path d="M16 21v1"/>
          <path d="M7 8h10"/>
          <path d="M7 12h10"/>
          <path d="M7 16h10"/>
        </svg>
      )
    },
    {
      id: 'magical',
      name: 'Magical Glow',
      description: 'Add magical glowing effects to the artwork',
      type: 'style',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          <path d="M5 3v4"/>
          <path d="M19 17v4"/>
          <path d="M3 5h4"/>
          <path d="M17 19h4"/>
        </svg>
      )
    }
  ];
  
  // Handle apply effect
  const handleApplyEffect = () => {
    const effectParams = {
      type: selectedEffect,
      intensity: effectIntensity / 100,
      advancedParams: advancedMode ? customParameters : null
    };
    
    onApplyEffect(effectParams);
  };
  
  // Update custom parameter value
  const updateCustomParameter = (param, value) => {
    setCustomParameters(prev => ({
      ...prev,
      [param]: value
    }));
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md border-2 border-ghibli-light-brown/20 ${className}`}
    >
      <h3 className="font-medium text-lg text-ghibli-dark-brown mb-3">AI Visual Effects</h3>
      
      {/* Effect selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-ghibli-dark-brown mb-2">
          Choose Effect
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
          {effects.map(effect => (
            <button
              key={effect.id}
              onClick={() => setSelectedEffect(effect.id)}
              className={`p-2 rounded-lg text-left flex items-start gap-2 transition-colors ${
                selectedEffect === effect.id
                  ? 'bg-ghibli-primary text-white'
                  : 'bg-ghibli-light-brown/20 text-ghibli-dark-brown hover:bg-ghibli-light-brown/30'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isProcessing}
            >
              <div className="mt-0.5">{effect.icon}</div>
              <div>
                <div className="font-medium text-sm">{effect.name}</div>
                <div className="text-xs opacity-80 line-clamp-2">{effect.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Effect intensity */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-ghibli-dark-brown mb-1">
          Effect Intensity
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="10"
            max="100"
            value={effectIntensity}
            onChange={(e) => setEffectIntensity(parseInt(e.target.value))}
            className="w-full h-2 bg-ghibli-light-brown/20 rounded-lg appearance-none cursor-pointer"
            disabled={isProcessing}
          />
          <span className="text-sm font-medium text-ghibli-dark-brown w-8 text-center">
            {effectIntensity}%
          </span>
        </div>
      </div>
      
      {/* Advanced parameters toggle */}
      <div className="mb-3">
        <button
          onClick={() => setAdvancedMode(!advancedMode)}
          className="flex items-center text-sm text-ghibli-dark-brown hover:text-ghibli-primary transition-colors"
          disabled={isProcessing}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={`mr-1 transition-transform ${advancedMode ? 'rotate-180' : ''}`}
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
          Advanced Settings
        </button>
        
        {/* Advanced parameters */}
        {advancedMode && (
          <div className="mt-2 space-y-2 bg-ghibli-light-brown/10 p-2 rounded-lg">
            <div>
              <label className="block text-xs font-medium text-ghibli-dark-brown mb-1">
                Color Balance
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customParameters.colorBalance}
                  onChange={(e) => updateCustomParameter('colorBalance', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-ghibli-light-brown/20 rounded-lg appearance-none cursor-pointer"
                  disabled={isProcessing}
                />
                <span className="text-xs font-medium text-ghibli-dark-brown w-6 text-center">
                  {customParameters.colorBalance}
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-ghibli-dark-brown mb-1">
                Lightness
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customParameters.lightness}
                  onChange={(e) => updateCustomParameter('lightness', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-ghibli-light-brown/20 rounded-lg appearance-none cursor-pointer"
                  disabled={isProcessing}
                />
                <span className="text-xs font-medium text-ghibli-dark-brown w-6 text-center">
                  {customParameters.lightness}
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-ghibli-dark-brown mb-1">
                Saturation
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customParameters.saturation}
                  onChange={(e) => updateCustomParameter('saturation', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-ghibli-light-brown/20 rounded-lg appearance-none cursor-pointer"
                  disabled={isProcessing}
                />
                <span className="text-xs font-medium text-ghibli-dark-brown w-6 text-center">
                  {customParameters.saturation}
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-ghibli-dark-brown mb-1">
                Contrast
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customParameters.contrast}
                  onChange={(e) => updateCustomParameter('contrast', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-ghibli-light-brown/20 rounded-lg appearance-none cursor-pointer"
                  disabled={isProcessing}
                />
                <span className="text-xs font-medium text-ghibli-dark-brown w-6 text-center">
                  {customParameters.contrast}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Apply effect button */}
      <button
        onClick={handleApplyEffect}
        disabled={isProcessing}
        className="w-full py-2 px-4 rounded-lg bg-ghibli-primary text-white hover:bg-ghibli-primary/90 disabled:opacity-50 transition-colors"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : `Apply ${effects.find(e => e.id === selectedEffect)?.name}`}
      </button>
      
      {/* Effect info */}
      <div className="mt-3 text-xs text-ghibli-dark-brown/70 italic">
        AI effects use machine learning to transform your artwork. Results may vary based on the complexity of your drawing.
      </div>
    </motion.div>
  );
};

export default RenderEffects; 