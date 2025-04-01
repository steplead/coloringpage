import React from 'react';

export interface StyleOption {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon: string;
}

export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Clean black outlines, minimal detail',
    prompt: 'black outline coloring page, clean lines, minimal detail',
    icon: '✏️'
  },
  {
    id: 'detailed',
    name: 'Detailed',
    description: 'More intricate patterns and texture details',
    prompt: 'black outline coloring page with intricate patterns, detailed textures, fine lines',
    icon: '🖌️'
  },
  {
    id: 'simple',
    name: 'Simple',
    description: 'Bold lines, fewer details (for younger children)',
    prompt: 'very simple black outline coloring page, bold thick lines, minimal details, suitable for young children',
    icon: '🧸'
  },
  {
    id: 'cartoon',
    name: 'Cartoon',
    description: 'Stylized, fun character-based style',
    prompt: 'cartoon style black outline coloring page, cute, whimsical, fun character design',
    icon: '🦸‍♂️'
  },
  {
    id: 'realistic',
    name: 'Realistic',
    description: 'More accurate proportions and details',
    prompt: 'realistic black outline coloring page, accurate proportions, anatomical details, clean lines',
    icon: '🔍'
  }
];

interface StyleSelectorProps {
  selectedStyle: string;
  onSelectStyle: (styleId: string) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ 
  selectedStyle, 
  onSelectStyle 
}) => {
  return (
    <div className="mb-6">
      <label className="block text-lg font-medium text-gray-700 mb-2">
        Style
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STYLE_OPTIONS.map((style) => (
          <button
            key={style.id}
            type="button"
            className={`p-4 rounded-lg text-center transition-all ${
              selectedStyle === style.id
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onSelectStyle(style.id)}
          >
            <div className="text-2xl mb-2">{style.icon}</div>
            <div className="font-medium">{style.name}</div>
            <div className="text-xs mt-1 opacity-80">{style.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}; 