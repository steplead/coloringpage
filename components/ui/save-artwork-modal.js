import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/auth-context';

export default function SaveArtworkModal({ isVisible, onClose, onSave, imageData, isProcessing }) {
  const { user, isAuthenticated } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter artwork title');
      return;
    }
    
    await onSave({
      title: title.trim(),
      description: description.trim(),
      isPublic,
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl max-w-lg w-full shadow-xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-ghibli-dark-brown">Save Artwork</h2>
                <button 
                  onClick={onClose}
                  className="text-ghibli-dark-brown/60 hover:text-ghibli-dark-brown"
                  disabled={isProcessing}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {!isAuthenticated ? (
                <div className="text-center py-6">
                  <p className="text-ghibli-dark-brown/80 mb-4">Please log in to save your artwork to the cloud, or save directly to your device</p>
                  <div className="flex justify-center space-x-4">
                    <a 
                      href="/login"
                      className="px-6 py-2 bg-ghibli-primary text-white rounded-full shadow-sm"
                    >
                      Log In
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        // Delay to ensure modal closes first
                        setTimeout(() => {
                          const canvas = document.querySelector('canvas');
                          if (canvas) {
                            try {
                              const dataUrl = canvas.toDataURL('image/png');
                              const link = document.createElement('a');
                              link.href = dataUrl;
                              link.download = `ghibli-coloring-${new Date().getTime()}.png`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            } catch (error) {
                              alert('Unable to save image. This may be due to security restrictions from cross-origin images.');
                            }
                          }
                        }, 100);
                      }}
                      className="px-6 py-2 bg-ghibli-secondary text-white rounded-full shadow-sm"
                    >
                      Save Locally
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700">
                      {error}
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label 
                      htmlFor="artwork-title" 
                      className="block text-ghibli-dark-brown/80 mb-1"
                    >
                      Artwork Title *
                    </label>
                    <input
                      id="artwork-title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Name your artwork"
                      className="w-full p-3 rounded-xl border-2 border-ghibli-light-brown/30 bg-ghibli-warm-white/90 focus:ring-2 focus:ring-ghibli-accent/50 focus:border-ghibli-accent"
                      disabled={isProcessing}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label 
                      htmlFor="artwork-description" 
                      className="block text-ghibli-dark-brown/80 mb-1"
                    >
                      Artwork Description
                    </label>
                    <textarea
                      id="artwork-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your artwork (optional)"
                      className="w-full p-3 rounded-xl border-2 border-ghibli-light-brown/30 bg-ghibli-warm-white/90 focus:ring-2 focus:ring-ghibli-accent/50 focus:border-ghibli-accent resize-none"
                      disabled={isProcessing}
                      rows={3}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="h-5 w-5 rounded border-ghibli-light-brown/50 text-ghibli-primary focus:ring-ghibli-primary/30"
                        disabled={isProcessing}
                      />
                      <span className="ml-2 text-ghibli-dark-brown/80">Make public (visible in community gallery)</span>
                    </label>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full"
                      disabled={isProcessing}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-ghibli-primary hover:bg-ghibli-primary/90 text-white rounded-full shadow-sm disabled:opacity-50"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </span>
                      ) : 'Save Artwork'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 