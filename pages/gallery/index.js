import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '../../components/layouts/main-layout';
import { motion } from 'framer-motion';

export default function GalleryPage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backgroundImagePath = '/ghibli-assets/backgrounds/default-bg.jpeg';

  // Load gallery artworks
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/gallery');
        
        if (!response.ok) {
          throw new Error('Failed to fetch gallery artworks');
        }
        
        const data = await response.json();
        // Make sure we're accessing the artworks array correctly from the API response
        setArtworks(data.artworks || []);
      } catch (error) {
        console.error('Gallery loading error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArtworks();
  }, []);

  return (
    <MainLayout
      title="Community Gallery - Magic Coloring World"
      backgroundImage={backgroundImagePath}
    >
      <Head>
        <title>Community Gallery - Magic Coloring World</title>
        <meta name="description" content="Explore amazing artworks created by the community" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md text-gradient-primary">
            Community Gallery
          </h1>
          <Link href="/coloring" className="ghibli-button flex items-center px-6 py-2">
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Artwork
            </span>
          </Link>
        </motion.div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-white flex flex-col items-center">
              <svg className="animate-spin h-10 w-10 text-ghibli-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">Loading magical creations...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <div className="ghibli-card-gradient p-6 max-w-md">
              <div className="text-ghibli-error-dark flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
              <div className="mt-4 flex justify-center">
                <button 
                  onClick={() => window.location.reload()}
                  className="ghibli-button-outline px-4 py-2"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        ) : artworks.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="ghibli-card-gradient p-8 text-center max-w-md">
              <h3 className="text-xl font-bold mb-4 text-gradient-secondary">No Artworks Yet</h3>
              <div className="text-ghibli-dark-brown/80 mb-6">Be the first to share your magical creation with the community!</div>
              <Link href="/coloring" className="ghibli-button-accent px-6 py-2 inline-block">
                Start Creating
              </Link>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {artworks.map((artwork, index) => (
              <motion.div 
                key={artwork.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="ghibli-card-gradient overflow-hidden shadow-ghibli-md hover:shadow-ghibli-lg transition-all duration-300 transform hover:scale-[1.02]"
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="aspect-w-1 aspect-h-1 w-full">
                    <img 
                      src={artwork.thumbnailUrl || artwork.imageUrl} 
                      alt={artwork.title}
                      className="object-cover w-full h-full rounded-t-lg"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <div className="text-white text-sm font-medium truncate w-full">
                      {new Date(artwork.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-ghibli-dark-brown truncate hover:text-gradient-primary transition-colors duration-300">{artwork.title}</h3>
                  {artwork.description && (
                    <p className="text-ghibli-dark-brown/80 text-sm mt-2 line-clamp-2">
                      {artwork.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
} 