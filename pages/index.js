import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '../components/layouts/main-layout';
import FloatingElements from '../components/animations/floating-elements';
import Link from 'next/link';

export default function Home() {
  // 背景图片路径 - 使用新的高质量背景图片
  const backgroundImagePath = '/ghibli-assets/backgrounds/main-bg.jpeg';
  const [prompt, setPrompt] = useState('boy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [translated, setTranslated] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a description');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          imageSize: 'landscape_4_3',
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error generating image');
      }
      
      setImageUrl(data.imageUrl);
      setTranslated(data.translated || '');
      
    } catch (err) {
      console.error('Request error:', err);
      setError(err.message || 'Error generating image');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `coloring-page-${prompt.substring(0, 10)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MainLayout 
      title="Ghibli Style Coloring Page Generator"
      backgroundImage={backgroundImagePath}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-md text-gradient-primary">
          Magic Coloring World
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow">
          Describe your imagination, and AI will create a magical coloring page for you. 
          Begin your creative journey!
        </p>
      </motion.div>
      
      <div className="max-w-2xl mx-auto ghibli-card-gradient">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label 
              htmlFor="prompt-input" 
              className="block text-ghibli-dark-brown font-ghibli text-xl mb-2"
            >
              Describe your scene
            </label>
            <div className="relative">
              <FloatingElements count={3} type="dust" />
              <textarea
                id="prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your scene, such as: a cottage in the forest, a castle by the sea..."
                className="w-full h-32 p-4 ghibli-input resize-none"
                rows={4}
              />
            </div>
          </div>
          
          <div className="mt-8 space-x-4">
            {imageUrl ? (
              <>
                <Link 
                  href={`/coloring?image=${encodeURIComponent(imageUrl)}`} 
                  className="ghibli-button py-3 px-6 inline-block"
                >
                  Start Coloring
                </Link>
                <button 
                  onClick={() => setImageUrl('')} 
                  className="ghibli-button-outline py-3 px-6 inline-block"
                >
                  Generate New
                </button>
              </>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !prompt.trim()}
                className={`ghibli-button py-3 px-6 inline-block ${loading || !prompt.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Magic...
                  </span>
                ) : 'Generate Line Art'}
              </button>
            )}
            <Link 
              href="/gallery" 
              className="ghibli-button-accent py-3 px-6 inline-block"
            >
              Explore Gallery
            </Link>
          </div>
        </form>
      </div>
        
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 max-w-2xl mx-auto p-4 bg-ghibli-error/10 border border-ghibli-error/20 rounded-xl text-ghibli-error-dark"
        >
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </motion.div>
      )}
        
      {translated && !error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 max-w-2xl mx-auto text-center text-white/80 text-sm drop-shadow-md bg-ghibli-primary-dark/30 backdrop-blur-xs p-2 rounded-full"
        >
          Translated prompt: <span className="font-semibold">{translated}</span>
        </motion.div>
      )}
        
      <AnimatePresence>
        {imageUrl && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-12 max-w-4xl mx-auto"
          >
            <div className="ghibli-card-gradient overflow-hidden">
              <h2 className="text-2xl font-bold mb-4 text-gradient-primary">Your Magic Coloring Page</h2>
              <div className="relative bg-white rounded-xl p-2 shadow-ghibli-inner">
                <img 
                  src={imageUrl} 
                  alt="Generated coloring page" 
                  className="w-full rounded-lg shadow-ghibli-md" 
                />
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button 
                    onClick={handleDownload}
                    className="ghibli-button-outline py-2 px-4 inline-block text-sm shadow-ghibli-md"
                  >
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Save Image
                    </span>
                  </button>
                  
                  <Link 
                    href={`/coloring?image=${encodeURIComponent(imageUrl)}`} 
                    className="ghibli-button py-2 px-4 inline-block text-sm shadow-ghibli-md"
                  >
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Color It Now
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
} 