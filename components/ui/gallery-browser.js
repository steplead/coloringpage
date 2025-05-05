import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Gallery Browser Component
 * Allows users to browse and filter artwork in the public gallery
 */
const GalleryBrowser = ({
  onSelectArtwork = () => {},
  className = ''
}) => {
  const [artworks, setArtworks] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  
  // Categories for artwork
  const categories = [
    'all',
    'animals',
    'landscape',
    'fantasy',
    'character',
    'abstract',
    'urban'
  ];
  
  // Sorting options
  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name', label: 'Name (A-Z)' }
  ];
  
  // Fetch artworks from API
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would be an API call
        // For demo, we're using mock data
        const mockArtworks = [
          {
            id: 'artwork-1',
            title: 'Fantasy Castle',
            imageUrl: '/ghibli-assets/backgrounds/castle.png',
            thumbnailUrl: '/ghibli-assets/backgrounds/castle_thumb.png',
            author: 'Anonymous',
            createdAt: '2023-08-15T10:30:00Z',
            category: 'fantasy',
            likes: 42,
            views: 128,
            tags: ['castle', 'fantasy', 'colorful']
          },
          {
            id: 'artwork-2',
            title: 'Forest Animals',
            imageUrl: '/ghibli-assets/backgrounds/forest.png',
            thumbnailUrl: '/ghibli-assets/backgrounds/forest_thumb.png',
            author: 'Guest Artist',
            createdAt: '2023-08-10T14:20:00Z',
            category: 'animals',
            likes: 38,
            views: 105,
            tags: ['animals', 'forest', 'cute']
          },
          {
            id: 'artwork-3',
            title: 'Mountain View',
            imageUrl: '/ghibli-assets/backgrounds/mountains.png',
            thumbnailUrl: '/ghibli-assets/backgrounds/mountains_thumb.png',
            author: 'Anonymous',
            createdAt: '2023-08-05T09:15:00Z',
            category: 'landscape',
            likes: 31,
            views: 92,
            tags: ['mountain', 'landscape', 'peaceful']
          },
          {
            id: 'artwork-4',
            title: 'Ocean Exploration',
            imageUrl: '/ghibli-assets/backgrounds/ocean.png',
            thumbnailUrl: '/ghibli-assets/backgrounds/ocean_thumb.png',
            author: 'Guest User',
            createdAt: '2023-07-28T16:45:00Z',
            category: 'landscape',
            likes: 27,
            views: 81,
            tags: ['ocean', 'sea', 'adventure']
          },
          {
            id: 'artwork-5',
            title: 'Flying Dragon',
            imageUrl: '/ghibli-assets/backgrounds/dragon.png',
            thumbnailUrl: '/ghibli-assets/backgrounds/dragon_thumb.png',
            author: 'Anonymous',
            createdAt: '2023-07-20T11:10:00Z',
            category: 'fantasy',
            likes: 53,
            views: 142,
            tags: ['dragon', 'fantasy', 'flying']
          },
          {
            id: 'artwork-6',
            title: 'Cat Collection',
            imageUrl: '/ghibli-assets/backgrounds/cats.png',
            thumbnailUrl: '/ghibli-assets/backgrounds/cats_thumb.png',
            author: 'Cat Lover',
            createdAt: '2023-07-15T08:30:00Z',
            category: 'animals',
            likes: 65,
            views: 210,
            tags: ['cats', 'cute', 'pets']
          },
          {
            id: 'artwork-7',
            title: 'City Skyline',
            imageUrl: '/ghibli-assets/backgrounds/city.png',
            thumbnailUrl: '/ghibli-assets/backgrounds/city_thumb.png',
            author: 'Urban Artist',
            createdAt: '2023-07-08T13:25:00Z',
            category: 'urban',
            likes: 29,
            views: 88,
            tags: ['city', 'buildings', 'urban']
          },
          {
            id: 'artwork-8',
            title: 'Space Adventure',
            imageUrl: '/ghibli-assets/backgrounds/space.png',
            thumbnailUrl: '/ghibli-assets/backgrounds/space_thumb.png',
            author: 'Anonymous',
            createdAt: '2023-07-01T15:50:00Z',
            category: 'fantasy',
            likes: 47,
            views: 130,
            tags: ['space', 'stars', 'adventure']
          }
        ];
        
        setArtworks(mockArtworks);
        setTotalPages(Math.ceil(mockArtworks.length / 8));
        
      } catch (error) {
        console.error('Error fetching artworks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArtworks();
  }, []);
  
  // Apply filters and sorting
  useEffect(() => {
    let result = [...artworks];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(artwork => artwork.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(artwork => 
        artwork.title.toLowerCase().includes(term) || 
        artwork.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'popular':
        result.sort((a, b) => b.likes - a.likes);
        break;
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    
    setFilteredArtworks(result);
    setTotalPages(Math.ceil(result.length / 8));
    setCurrentPage(1); // Reset to first page when filters change
  }, [artworks, selectedCategory, searchTerm, sortBy]);
  
  // Get artworks for current page
  const getCurrentPageArtworks = () => {
    const startIndex = (currentPage - 1) * 8;
    const endIndex = startIndex + 8;
    return filteredArtworks.slice(startIndex, endIndex);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md border-2 border-ghibli-light-brown/20 ${className}`}
    >
      <h2 className="font-medium text-xl text-ghibli-dark-brown mb-4">Public Gallery</h2>
      
      {/* Search and filter controls */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        {/* Search input */}
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search artworks..."
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
        
        {/* Sort selector */}
        <div className="flex-shrink-0 md:w-48">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full p-2 rounded-lg border-2 border-ghibli-light-brown/30 bg-ghibli-warm-white/90 focus:ring-2 focus:ring-ghibli-accent/50 focus:border-ghibli-accent text-sm"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Category tabs */}
      <div className="flex mb-4 overflow-x-auto pb-1 scrollbar-thin">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
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
      
      {/* Artworks grid */}
      <div className="mb-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-ghibli-primary"></div>
          </div>
        ) : getCurrentPageArtworks().length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {getCurrentPageArtworks().map((artwork) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="cursor-pointer group"
                  onClick={() => onSelectArtwork(artwork)}
                >
                  <div className="relative rounded-lg overflow-hidden border-2 border-ghibli-light-brown/30 bg-ghibli-warm-white/80 group-hover:border-ghibli-primary transition-colors">
                    {/* Artwork thumbnail */}
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={artwork.thumbnailUrl || artwork.imageUrl}
                        alt={artwork.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    
                    {/* Artwork info */}
                    <div className="p-2 bg-white/90">
                      <h3 className="text-sm font-medium text-ghibli-dark-brown truncate">{artwork.title}</h3>
                      <div className="flex justify-between items-center mt-1 text-xs text-ghibli-dark-brown/70">
                        <div>{formatDate(artwork.createdAt)}</div>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          {artwork.likes}
                        </div>
                      </div>
                    </div>
                    
                    {/* Category badge */}
                    <div className="absolute top-2 left-2">
                      <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                        {artwork.category}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-ghibli-dark-brown/70">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg">No artworks found</p>
            <p className="text-sm mt-1">Try different search terms or categories</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {filteredArtworks.length > 8 && (
        <div className="flex justify-center mt-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg bg-ghibli-light-brown/20 text-ghibli-dark-brown hover:bg-ghibli-light-brown/30 disabled:opacity-50 text-sm"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-sm ${
                  currentPage === page
                    ? 'bg-ghibli-primary text-white'
                    : 'bg-ghibli-light-brown/20 text-ghibli-dark-brown hover:bg-ghibli-light-brown/30'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg bg-ghibli-light-brown/20 text-ghibli-dark-brown hover:bg-ghibli-light-brown/30 disabled:opacity-50 text-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}
      
      {/* Info text */}
      <div className="mt-4 text-xs text-ghibli-dark-brown/70 italic text-center">
        Browse artworks from our community. Click on any artwork to view details or use it as inspiration.
      </div>
    </motion.div>
  );
};

export default GalleryBrowser; 