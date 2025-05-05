import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Color Suggestions Component
 * 提供AI颜色建议，帮助用户选择颜色
 */
const ColorSuggestions = ({
  isVisible = false,
  onSelect = () => {},
  onClose = () => {},
  isLoading = false,
  suggestions = null
}) => {
  // 预设的颜色方案组，用于演示
  const defaultColorPalettes = [
    {
      id: 'ghibli-forest',
      name: 'Ghibli Forest',
      description: 'Colors inspired by Ghibli forest scenes',
      colors: ['#8cc152', '#4a8fdd', '#fcbb42', '#73553a', '#d2b48c', '#a0d468']
    },
    {
      id: 'ghibli-sky',
      name: 'Ghibli Sky',
      description: 'Colors for painting skies and clouds',
      colors: ['#4a8fdd', '#e4eefb', '#ffffff', '#f8f4e3', '#7bb2e3', '#d9ecff']
    },
    {
      id: 'ghibli-sunset',
      name: 'Ghibli Sunset',
      description: 'Warm sunset palette for backgrounds',
      colors: ['#fc6e51', '#ffce54', '#fcbb42', '#ed5565', '#f8f4e3', '#967adc']
    },
    {
      id: 'ghibli-character',
      name: 'Character Colors',
      description: 'Colors suitable for characters',
      colors: ['#d2b48c', '#73553a', '#f8f4e3', '#fc6e51', '#4a8fdd', '#ed5565']
    }
  ];
  
  // 使用提供的建议或默认值
  const [colorPalettes, setColorPalettes] = useState(suggestions || defaultColorPalettes);
  
  // 当suggestions改变时更新状态
  useEffect(() => {
    if (suggestions) {
      setColorPalettes(suggestions);
    }
  }, [suggestions]);
  
  // 选择单个颜色
  const handleColorSelect = (color) => {
    onSelect(color);
  };
  
  // 选择整个调色板
  const handlePaletteSelect = (palette) => {
    // 通知父组件该调色板被选中
    onSelect(palette);
  };
  
  if (!isVisible) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="bg-white rounded-xl p-5 shadow-ghibli-lg border-2 border-ghibli-light-brown/20 max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-ghibli text-xl text-ghibli-dark-brown">Color Suggestions</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-ghibli-light-brown/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <svg className="animate-spin h-8 w-8 text-ghibli-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-ghibli-dark-brown">AI is analyzing your artwork and suggesting colors...</p>
            </div>
          ) : (
            <>
              <p className="text-ghibli-dark-brown/70 mb-4">
                AI has suggested these color palettes based on your artwork. Click on any color to use it, or choose an entire palette.
              </p>
              
              <div className="space-y-4">
                {colorPalettes.map((palette) => (
                  <div 
                    key={palette.id}
                    className="bg-ghibli-warm-white/50 rounded-lg p-3 border border-ghibli-light-brown/20 hover:border-ghibli-light-brown/40 transition-colors cursor-pointer"
                    onClick={() => handlePaletteSelect(palette)}
                  >
                    <h4 className="font-medium text-ghibli-dark-brown mb-1">{palette.name}</h4>
                    <p className="text-sm text-ghibli-dark-brown/70 mb-2">{palette.description}</p>
                    <div className="flex space-x-2">
                      {palette.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleColorSelect(color);
                          }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-full bg-ghibli-light-brown/20 text-ghibli-dark-brown hover:bg-ghibli-light-brown/30 transition-colors"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ColorSuggestions;