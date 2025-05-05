import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Template Selector Component
 * Enhanced with categories and AI tags support
 */
const TemplateSelector = ({
  onSelectTemplate = () => {},
  className = '',
  isLoading = false
}) => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  
  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoadingTemplates(true);
        
        // Sample data structure for templates with categories and tags
        // In a real app, this would come from an API
        const templateData = [
          {
            id: 'template1',
            name: 'Mountain Landscape',
            imageUrl: '/ghibli-assets/backgrounds/mountains.png',
            thumbnail: '/ghibli-assets/backgrounds/mountains_thumb.png',
            category: 'landscape',
            aiTags: ['nature', 'mountains', 'peaceful'],
            popularity: 85
          },
          {
            id: 'template2',
            name: 'Forest Animals',
            imageUrl: '/ghibli-assets/backgrounds/forest.png',
            thumbnail: '/ghibli-assets/backgrounds/forest_thumb.png',
            category: 'animals',
            aiTags: ['forest', 'wildlife', 'cute'],
            popularity: 92
          },
          {
            id: 'template3',
            name: 'Ocean Scene',
            imageUrl: '/ghibli-assets/backgrounds/ocean.png',
            thumbnail: '/ghibli-assets/backgrounds/ocean_thumb.png',
            category: 'landscape',
            aiTags: ['water', 'sea', 'nature'],
            popularity: 78
          },
          {
            id: 'template4',
            name: 'Castle on Hill',
            imageUrl: '/ghibli-assets/backgrounds/castle.png',
            thumbnail: '/ghibli-assets/backgrounds/castle_thumb.png',
            category: 'fantasy',
            aiTags: ['castle', 'medieval', 'adventure'],
            popularity: 88
          },
          {
            id: 'template5',
            name: 'Flying Dragon',
            imageUrl: '/ghibli-assets/backgrounds/dragon.png',
            thumbnail: '/ghibli-assets/backgrounds/dragon_thumb.png',
            category: 'fantasy',
            aiTags: ['dragon', 'magical', 'flying'],
            popularity: 90
          },
          {
            id: 'template6',
            name: 'Cute Cats',
            imageUrl: '/ghibli-assets/backgrounds/cats.png',
            thumbnail: '/ghibli-assets/backgrounds/cats_thumb.png',
            category: 'animals',
            aiTags: ['cats', 'pets', 'cute'],
            popularity: 95
          },
          {
            id: 'template7',
            name: 'City Skyline',
            imageUrl: '/ghibli-assets/backgrounds/city.png',
            thumbnail: '/ghibli-assets/backgrounds/city_thumb.png',
            category: 'urban',
            aiTags: ['city', 'buildings', 'modern'],
            popularity: 75
          },
          {
            id: 'template8',
            name: 'Space Adventure',
            imageUrl: '/ghibli-assets/backgrounds/space.png',
            thumbnail: '/ghibli-assets/backgrounds/space_thumb.png',
            category: 'fantasy',
            aiTags: ['space', 'stars', 'adventure'],
            popularity: 86
          }
        ];
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(templateData.map(t => t.category)));
        setCategories(['all', ...uniqueCategories]);
        
        setTemplates(templateData);
        setFilteredTemplates(templateData);
        
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setIsLoadingTemplates(false);
      }
    };
    
    fetchTemplates();
  }, []);
  
  // Filter templates when category or search term changes
  useEffect(() => {
    let result = templates;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(template => template.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(template => 
        template.name.toLowerCase().includes(term) || 
        template.aiTags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    setFilteredTemplates(result);
  }, [templates, selectedCategory, searchTerm]);
  
  // Handle template selection
  const handleSelectTemplate = (template) => {
    onSelectTemplate(template);
  };
  
  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md border-2 border-ghibli-light-brown/20 ${className}`}
    >
      <h3 className="font-medium text-lg text-ghibli-dark-brown mb-3">Choose a Template</h3>
      
      {/* Search input */}
      <div className="mb-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-8 rounded-lg border-2 border-ghibli-light-brown/30 bg-ghibli-warm-white/90 focus:ring-2 focus:ring-ghibli-accent/50 focus:border-ghibli-accent text-sm"
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 absolute left-2.5 top-2.5 text-ghibli-dark-brown/60" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      {/* Category tabs */}
      <div className="flex mb-3 overflow-x-auto pb-1 scrollbar-thin">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-3 py-1 mr-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-ghibli-primary text-white'
                : 'bg-ghibli-light-brown/20 text-ghibli-dark-brown hover:bg-ghibli-light-brown/30'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Templates grid */}
      <div className="h-64 overflow-y-auto pr-1">
        {isLoadingTemplates ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ghibli-primary"></div>
          </div>
        ) : filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className="cursor-pointer group"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-ghibli-light-brown/30 bg-ghibli-warm-white/80 group-hover:border-ghibli-primary transition-colors">
                  {/* Template thumbnail */}
                  <img
                    src={template.thumbnail || template.imageUrl}
                    alt={template.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  
                  {/* Template name overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1.5">
                    <p className="text-xs text-white font-medium truncate">{template.name}</p>
                  </div>
                  
                  {/* AI Tags */}
                  <div className="absolute top-1 right-1 flex flex-wrap justify-end gap-1">
                    {template.aiTags.slice(0, 2).map((tag) => (
                      <span 
                        key={tag} 
                        className="bg-ghibli-primary/90 text-white text-[9px] px-1.5 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-ghibli-dark-brown/70">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 13.5h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">No templates found</p>
            <p className="text-xs mt-1">Try a different search or category</p>
          </div>
        )}
      </div>
      
      {/* Template info */}
      <div className="mt-3 text-xs text-ghibli-dark-brown/70 italic">
        Select a template to start coloring or use the AI generator to create a custom template.
      </div>
    </motion.div>
  );
};

export default TemplateSelector; 