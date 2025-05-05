import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * AI Brush Tools Component
 * Provides advanced AI-powered brush types for enhanced coloring experience
 */
const AIBrushTools = ({
  onSelectBrush = () => {},
  activeBrush = 'standard',
  className = '',
  isProcessing = false
}) => {
  const [brushIntensity, setBrushIntensity] = useState(70);
  
  // AI brush types
  const brushTypes = [
    { 
      id: 'standard', 
      name: 'Standard', 
      description: 'Regular coloring brush',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.79 10.22 20 12.433v4.134a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4.134l2.21-2.212a4.99 4.99 0 0 1 3.54-1.466h4.5a4.99 4.99 0 0 1 3.54 1.466Z"/>
          <path d="M16 12.422V6.999a2 2 0 1 0-4 0"/>
          <path d="M13 7h2"/>
        </svg>
      )
    },
    { 
      id: 'smart-color', 
      name: 'Smart Color', 
      description: 'Intelligently adjusts colors based on surrounding areas',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9.5 1.5 3.5 3.5-3.5 3.5"/>
          <path d="M6 13.5V10h7"/>
          <path d="m21 16.5-3.5 3.5-3.5-3.5"/>
          <path d="M18 10v3.5h-7"/>
          <path d="M3 8h3"/>
          <path d="M21 8h-3"/>
          <path d="M3 16h3"/>
          <path d="M21 16h-3"/>
        </svg>
      )
    },
    { 
      id: 'texture', 
      name: 'Texture', 
      description: 'Adds realistic textures while coloring',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18"/>
          <path d="M7 14.5 9.5 12 7 9.5"/>
          <path d="M11 9.5 8.5 12 11 14.5"/>
          <path d="M13 9.5 15.5 12 13 14.5"/>
          <path d="M17 9.5 14.5 12 17 14.5"/>
        </svg>
      )
    },
    { 
      id: 'blend', 
      name: 'Blend', 
      description: 'Smoothly blends colors together',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
          <path d="M2 12h20"/>
        </svg>
      )
    },
    { 
      id: 'shade', 
      name: 'Smart Shade', 
      description: 'Automatically adds shading based on line art',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 4h.01"/>
          <path d="M20 12h.01"/>
          <path d="M12 20h.01"/>
          <path d="M4 12h.01"/>
          <path d="M17.657 6.343h.01"/>
          <path d="M17.657 17.657h.01"/>
          <path d="M6.343 17.657h.01"/>
          <path d="M6.343 6.343h.01"/>
        </svg>
      )
    },
    { 
      id: 'pattern', 
      name: 'Pattern', 
      description: 'Fills with artistic patterns',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="7" x="3" y="3" rx="1"/>
          <rect width="7" height="7" x="14" y="3" rx="1"/>
          <rect width="7" height="7" x="14" y="14" rx="1"/>
          <rect width="7" height="7" x="3" y="14" rx="1"/>
        </svg>
      )
    },
  ];
  
  // Apply brush selection
  const handleBrushSelect = (brushId) => {
    onSelectBrush({
      type: brushId,
      intensity: brushIntensity / 100
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md border-2 border-ghibli-light-brown/20 ${className}`}
    >
      <h3 className="font-medium text-lg text-ghibli-dark-brown mb-3">AI Brushes</h3>
      
      {/* Brush Type Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-ghibli-dark-brown mb-2">
          Brush Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {brushTypes.map(brush => (
            <button
              key={brush.id}
              onClick={() => handleBrushSelect(brush.id)}
              className={`p-2 rounded-lg text-left flex items-start gap-2 transition-colors ${
                activeBrush === brush.id
                  ? 'bg-ghibli-primary text-white'
                  : 'bg-ghibli-light-brown/20 text-ghibli-dark-brown hover:bg-ghibli-light-brown/30'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isProcessing}
            >
              <div className="mt-0.5">{brush.icon}</div>
              <div>
                <div className="font-medium text-sm">{brush.name}</div>
                <div className="text-xs opacity-80 line-clamp-2">{brush.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Brush Intensity */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-ghibli-dark-brown mb-1">
          Effect Intensity
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="10"
            max="100"
            value={brushIntensity}
            onChange={(e) => setBrushIntensity(parseInt(e.target.value))}
            className="w-full h-2 bg-ghibli-light-brown/20 rounded-lg appearance-none cursor-pointer"
            disabled={isProcessing}
          />
          <span className="text-sm font-medium text-ghibli-dark-brown w-8 text-center">
            {brushIntensity}%
          </span>
        </div>
      </div>
      
      {/* Tip for users */}
      <div className="text-xs text-ghibli-dark-brown/70 italic mt-2">
        AI brushes analyze your drawing to provide enhanced coloring effects. Results may vary based on line art complexity.
      </div>
    </motion.div>
  );
};

export default AIBrushTools; 