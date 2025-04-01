import React from 'react';

export interface PromptCategory {
  name: string;
  examples: string[];
  icon: string;
}

export const PROMPT_CATEGORIES: PromptCategory[] = [
  { 
    name: 'Animals', 
    examples: [
      'Lion with detailed mane',
      'Cute cat playing with yarn',
      'Elephant with decorative pattern',
      'Dolphin jumping over waves',
      'Owl perched on a branch',
      'Butterfly with intricate wing patterns',
      'Fox in the forest',
      'Giraffe family under a tree'
    ],
    icon: '🐾'
  },
  { 
    name: 'Vehicles', 
    examples: [
      'Sports car with racing stripes',
      'Vintage motorcycle with details',
      'Space rocket blasting off',
      'Steam locomotive on tracks',
      'Sailing ship on ocean waves',
      'Monster truck with big wheels',
      'Fire truck with ladder extended',
      'Helicopter in flight'
    ],
    icon: '🚗'
  },
  { 
    name: 'Fantasy', 
    examples: [
      'Dragon with spread wings',
      'Unicorn in magical forest',
      'Fairy with flower wings',
      'Castle on a mountain',
      'Wizard casting a spell',
      'Mermaid on a rock',
      'Knight in detailed armor',
      'Mythical phoenix bird'
    ],
    icon: '✨'
  },
  { 
    name: 'Nature', 
    examples: [
      'Mountain landscape with pine trees',
      'Underwater coral reef scene',
      'Tropical rainforest with animals',
      'Desert scene with cactus',
      'Waterfall in the jungle',
      'Garden with blooming flowers',
      'Forest path with sunlight',
      'Beach scene with shells'
    ],
    icon: '🌿'
  },
  {
    name: 'Characters',
    examples: [
      'Superhero in action pose',
      'Princess with beautiful dress',
      'Astronaut exploring space',
      'Pirate with treasure map',
      'Ninja in stealth mode',
      'Cowboy on a horse',
      'Robot with mechanical details',
      'Firefighter rescuing cat'
    ],
    icon: '👤'
  },
  { 
    name: 'Holidays', 
    examples: [
      'Christmas tree with ornaments',
      'Halloween pumpkin with face',
      'Easter bunny with basket',
      'Birthday cake with candles',
      'Valentine hearts with flowers',
      'Thanksgiving turkey',
      'New Year fireworks display',
      'Fourth of July celebration'
    ],
    icon: '🎄'
  }
];

interface ExamplePromptsProps {
  onSelectPrompt: (prompt: string) => void;
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const ExamplePrompts: React.FC<ExamplePromptsProps> = ({
  onSelectPrompt,
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div className="mb-6">
      <label className="block text-lg font-medium text-gray-700 mb-2">
        Example Ideas
      </label>
      
      {/* Category selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PROMPT_CATEGORIES.map((category) => (
          <button
            key={category.name}
            type="button"
            className={`px-3 py-1 rounded-full flex items-center ${
              selectedCategory === category.name
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onSelectCategory(selectedCategory === category.name ? null : category.name)}
          >
            <span className="mr-1">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
      
      {/* Example prompts */}
      {selectedCategory && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-3">{selectedCategory} Ideas:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {PROMPT_CATEGORIES.find(c => c.name === selectedCategory)?.examples.map((example, index) => (
              <button
                key={index}
                type="button"
                className="text-left px-3 py-2 bg-white rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-200 text-sm transition-colors"
                onClick={() => onSelectPrompt(example)}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {!selectedCategory && (
        <p className="text-gray-500 text-sm italic">
          Select a category above to see example prompts
        </p>
      )}
    </div>
  );
}; 