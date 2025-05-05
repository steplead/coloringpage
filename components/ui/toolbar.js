import { motion } from 'framer-motion';
import { useState } from 'react';

/**
 * Drawing Toolbar Component
 * Provides drawing tools and color selection
 */
const Toolbar = ({
  brushSize = 5,
  onBrushSizeChange = () => {},
  brushColor = '#000000',
  onBrushColorChange = () => {},
  mode = 'draw',
  onModeChange = () => {},
  onSave = () => {},
  onClear = () => {},
  onUndo = () => {},
  onRedo = () => {},
  canUndo = false,
  canRedo = false,
  onToggleAIBrushTools = () => {},
  className = '',
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Predefined color palette in Ghibli style
  const colorPalette = [
    '#000000', // Black
    '#4a8fdd', // Ghibli Sky Blue
    '#8cc152', // Ghibli Green
    '#fcbb42', // Ghibli Yellow
    '#d2b48c', // Light Brown
    '#73553a', // Dark Brown
    '#ed5565', // Red
    '#fc6e51', // Orange
    '#967adc', // Purple
    '#ffffff', // White
  ];
  
  // Brush size presets
  const brushSizes = [2, 5, 10, 15, 20];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-ghibli-md border-2 border-ghibli-light-brown/20 ${className}`}
    >
      {/* Drawing Tools */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <ToolButton 
          active={mode === 'draw'} 
          onClick={() => onModeChange('draw')}
          title="Draw"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.79 10.22 20 12.433v4.134a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4.134l2.21-2.212a4.99 4.99 0 0 1 3.54-1.466h4.5a4.99 4.99 0 0 1 3.54 1.466Z"/>
            <path d="M16 12.422V6.999a2 2 0 1 0-4 0"/>
            <path d="M13 7h2"/>
          </svg>
        </ToolButton>
        
        <ToolButton 
          active={mode === 'erase'} 
          onClick={() => onModeChange('erase')}
          title="Erase"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/>
            <path d="M22 21H7"/>
            <path d="m5 11 9 9"/>
          </svg>
        </ToolButton>
        
        <ToolButton 
          active={mode === 'fill'} 
          onClick={() => onModeChange('fill')}
          title="Fill"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z"/>
            <path d="m5 2 5 5"/>
            <path d="M2 13h15"/>
            <path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z"/>
          </svg>
        </ToolButton>
        
        <ToolButton 
          onClick={onToggleAIBrushTools}
          title="AI Brushes"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 16c-2 0-4-1-4-4 0-2 1-3 2-4l.5-1c-1-.5-2-2.5-2-4.5 0-3 2.5-6 7-6s7 3 7 6c0 2-1 4-2 4.5l.5 1c1 1 2 2 2 4 0 3-2 4-4 4 0 1.5-3 2.5-3.5 3-3.5 3.5-13-3-3.5-3Z"/>
            <path d="M13 21c6.667-1 6.667-6 3-10"/>
          </svg>
        </ToolButton>
        
        <div className="h-6 w-px bg-ghibli-light-brown/30 mx-1"></div>
        
        <ToolButton 
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7v6h6"/>
            <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
          </svg>
        </ToolButton>
        
        <ToolButton 
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 7v6h-6"/>
            <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/>
          </svg>
        </ToolButton>
        
        <div className="h-6 w-px bg-ghibli-light-brown/30 mx-1"></div>
        
        <ToolButton 
          onClick={onClear}
          title="Clear"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"/>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
        </ToolButton>
        
        <ToolButton 
          onClick={onSave}
          title="Save"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
        </ToolButton>
      </div>
      
      {/* Brush Size Control */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-ghibli-dark-brown mb-1">
          Brush Size
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="1"
            max="30"
            value={brushSize}
            onChange={(e) => onBrushSizeChange(parseInt(e.target.value))}
            className="w-full h-2 bg-ghibli-light-brown/20 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm font-medium text-ghibli-dark-brown w-6 text-center">
            {brushSize}
          </span>
        </div>
        <div className="flex justify-between mt-2">
          {brushSizes.map((size) => (
            <button
              key={size}
              onClick={() => onBrushSizeChange(size)}
              className={`w-${Math.min(size / 2, 8)} h-${Math.min(size / 2, 8)} rounded-full ${
                brushSize === size ? 'bg-ghibli-primary' : 'bg-ghibli-light-brown/40'
              } hover:bg-ghibli-primary/80 transition-colors`}
              title={`Size ${size}`}
            />
          ))}
        </div>
      </div>
      
      {/* Color Selection */}
      <div>
        <label className="block text-sm font-medium text-ghibli-dark-brown mb-1">
          Color
        </label>
        <div className="flex items-center mb-2">
          <div 
            className="w-8 h-8 rounded-full border-2 border-ghibli-light-brown/30 mr-2 cursor-pointer"
            style={{ backgroundColor: brushColor }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          />
          
          <input
            type="color"
            value={brushColor}
            onChange={(e) => onBrushColorChange(e.target.value)}
            className="h-0 w-0 opacity-0 absolute"
            id="color-picker"
          />
          <label 
            htmlFor="color-picker"
            className="px-2 py-1 text-xs bg-ghibli-light-brown/20 hover:bg-ghibli-light-brown/30 rounded-md cursor-pointer transition-colors"
          >
            Custom
          </label>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-1">
          {colorPalette.map((color) => (
            <div
              key={color}
              className={`w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110 ${
                brushColor === color ? 'ring-2 ring-ghibli-primary ring-offset-1' : ''
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onBrushColorChange(color)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Helper component for tool buttons
const ToolButton = ({ children, active, disabled, onClick, title }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded-lg transition-colors ${
      active 
        ? 'bg-ghibli-primary text-white' 
        : disabled 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : 'bg-ghibli-light-brown/20 text-ghibli-dark-brown hover:bg-ghibli-light-brown/30'
    }`}
    title={title}
  >
    {children}
  </motion.button>
);

export default Toolbar; 