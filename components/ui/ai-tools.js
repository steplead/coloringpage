import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * AI Tools Component
 * 提供AI辅助工具，帮助用户着色和绘画
 */
const AITools = ({
  onApplyAIEffect = () => {},
  onRequestColorSuggestion = () => {},
  onApplyAutoColoring = () => {},
  className = '',
  isProcessing = false
}) => {
  const [selectedEffect, setSelectedEffect] = useState('enhance');
  const [intensity, setIntensity] = useState(50);
  
  // AI效果列表
  const aiEffects = [
    { id: 'enhance', name: 'Enhance Lines', description: 'Improve and clarify line art' },
    { id: 'smooth', name: 'Smooth Drawing', description: 'Smooth rough sketch lines' },
    { id: 'clean', name: 'Clean Drawing', description: 'Remove stray marks and clean up the drawing' },
    { id: 'outline', name: 'Create Outline', description: 'Generate clean outlines from a rough sketch' }
  ];
  
  // 应用AI效果
  const applySelectedEffect = () => {
    onApplyAIEffect({
      effect: selectedEffect,
      intensity: intensity / 100
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-ghibli-md border-2 border-ghibli-light-brown/20 ${className}`}
    >
      <h3 className="font-ghibli text-lg text-ghibli-dark-brown mb-3">AI Assistant</h3>
      
      {/* AI效果选择 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-ghibli-dark-brown mb-1">
          Effects
        </label>
        <div className="grid grid-cols-2 gap-2">
          {aiEffects.map(effect => (
            <button
              key={effect.id}
              onClick={() => setSelectedEffect(effect.id)}
              className={`p-2 rounded-lg text-left text-sm transition-colors ${
                selectedEffect === effect.id
                  ? 'bg-ghibli-primary text-white'
                  : 'bg-ghibli-light-brown/20 text-ghibli-dark-brown hover:bg-ghibli-light-brown/30'
              }`}
            >
              <div className="font-medium">{effect.name}</div>
              <div className="text-xs opacity-80">{effect.description}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* 效果强度 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-ghibli-dark-brown mb-1">
          Effect Intensity
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="10"
            max="100"
            value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value))}
            className="w-full h-2 bg-ghibli-light-brown/20 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm font-medium text-ghibli-dark-brown w-8 text-center">
            {intensity}%
          </span>
        </div>
      </div>
      
      {/* 应用AI效果按钮 */}
      <button
        onClick={applySelectedEffect}
        disabled={isProcessing}
        className="w-full py-2 px-4 mb-3 ghibli-button disabled:opacity-50 text-sm"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : `Apply ${aiEffects.find(e => e.id === selectedEffect)?.name}`}
      </button>
      
      {/* 分隔线 */}
      <div className="border-t border-ghibli-light-brown/20 my-3"></div>
      
      {/* 其他AI功能 */}
      <div className="space-y-2">
        <button
          onClick={onRequestColorSuggestion}
          disabled={isProcessing}
          className="w-full py-2 px-4 rounded-lg transition-colors bg-ghibli-accent text-white hover:bg-ghibli-accent/90 disabled:opacity-50 text-sm"
        >
          Suggest Colors
        </button>
        
        <button
          onClick={onApplyAutoColoring}
          disabled={isProcessing}
          className="w-full py-2 px-4 rounded-lg transition-colors bg-ghibli-secondary text-white hover:bg-ghibli-secondary/90 disabled:opacity-50 text-sm"
        >
          Auto Color (Magic)
        </button>
      </div>
      
      {/* AI提示 */}
      <div className="mt-4 text-xs text-ghibli-dark-brown/70 italic">
        AI can help improve your drawing and suggest color palettes based on your artwork.
      </div>
    </motion.div>
  );
};

export default AITools; 