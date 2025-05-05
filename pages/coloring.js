import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../components/layouts/main-layout';
import Canvas from '../components/ui/canvas';
import Toolbar from '../components/ui/toolbar';
import AITools from '../components/ui/ai-tools';
import AIBrushTools from '../components/ui/ai-brush-tools';
import TemplateSelector from '../components/ui/template-selector';
import ColorSuggestions from '../components/ui/color-suggestions';
import HistoryManager from '../components/ui/history-manager';
import SaveArtworkModal from '../components/ui/save-artwork-modal';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/auth-context';
import Head from 'next/head';

export default function ColoringPage() {
  // Get router and authentication status
  const router = useRouter();
  const { user } = useAuth();
  
  // Background image
  const backgroundImagePath = '/ghibli-assets/backgrounds/default-bg.jpeg';
  
  // States
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [mode, setMode] = useState('draw');
  const [canvasImage, setCanvasImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showColorSuggestions, setShowColorSuggestions] = useState(false);
  const [colorSuggestions, setColorSuggestions] = useState(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [showAIBrushTools, setShowAIBrushTools] = useState(false);
  const [activeBrush, setActiveBrush] = useState('standard');
  const [aiBrush, setAIBrush] = useState({ type: 'standard', intensity: 0.7 });
  
  // Refs
  const canvasRef = useRef(null);
  const historyManagerRef = useRef(new HistoryManager());
  
  // Get image from URL parameter and load it
  useEffect(() => {
    if (router.query.image && canvasRef.current) {
      setIsProcessing(true);
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      const img = new Image();
      // Set cross-origin attribute
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        // Clear Canvas
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Fit image to canvas
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
        
        // Update history
        historyManagerRef.current.clear();
        historyManagerRef.current.addToHistory(canvas);
        updateHistoryState();
        
        setIsProcessing(false);
      };
      
      img.onerror = () => {
        console.error('Failed to load image from URL parameter');
        setIsProcessing(false);
      };
      
      // Add timestamp or random parameter to avoid caching issues
      const imageUrl = router.query.image;
      img.src = imageUrl.includes('?') 
        ? `${imageUrl}&nocache=${new Date().getTime()}` 
        : `${imageUrl}?nocache=${new Date().getTime()}`;
    }
  }, [router.query.image, canvasRef.current]);
  
  // Update history state
  const updateHistoryState = () => {
    const historyManager = historyManagerRef.current;
    setCanUndo(historyManager.canUndo());
    setCanRedo(historyManager.canRedo());
  };
  
  // Handle drawing
  const handleDraw = (canvas) => {
    // Update history
    historyManagerRef.current.addToHistory(canvas);
    updateHistoryState();
  };
  
  // Clear canvas
  const handleClear = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update history
    historyManagerRef.current.addToHistory(canvas);
    updateHistoryState();
  };
  
  // Save image to local
  const handleSave = () => {
    if (!canvasRef.current) return;
    
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `ai-coloring-page-${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Unable to save image:', error);
      alert('Unable to save image. This may be due to security restrictions from cross-origin images.');
    }
  };
  
  // Open save to account modal
  const handleSaveToAccount = async () => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      // Get Canvas image data
      let imageData;
      try {
        imageData = canvasRef.current.toDataURL('image/png');
      } catch (error) {
        console.error('Unable to export Canvas data:', error);
        throw new Error('Unable to get canvas data. This may be due to security restrictions from cross-origin images.');
      }

      // Create thumbnail
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = async () => {
        // Scale drawing
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        
        let thumbnailData;
        try {
          thumbnailData = canvas.toDataURL('image/png');
        } catch (error) {
          console.error('Unable to create thumbnail:', error);
          thumbnailData = null; // Thumbnail creation failed, use null
        }
        
        // Send to API to save to public gallery
        try {
          const title = `AI Coloring Page ${new Date().toLocaleString()}`; // Default title
          
          const response = await fetch('/api/gallery', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: title,
              description: 'Artwork created with AI Coloring Page tool',
              image_data: imageData,
              thumbnail: thumbnailData,
            }),
          });
          
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to save artwork');
          }
          
          setIsSaving(false);
          
          // Prompt save success
          alert('Artwork has been successfully saved to the public gallery!');
          
          // Redirect to gallery page after save
          setTimeout(() => {
            router.push('/gallery');
          }, 1000);
        } catch (error) {
          console.error('API call failed:', error);
          setSaveError(error.message || 'Failed to save artwork');
          setIsSaving(false);
        }
      };
      
      img.onerror = () => {
        console.error('Unable to load image data');
        setSaveError('Failed to process image data');
        setIsSaving(false);
      };
      
      img.src = imageData;
      
    } catch (error) {
      console.error('Failed to save artwork:', error);
      setSaveError(error.message || 'Failed to save artwork');
      setIsSaving(false);
    }
  };
  
  // Undo operation
  const handleUndo = () => {
    if (historyManagerRef.current.undo(canvasRef.current)) {
      updateHistoryState();
    }
  };
  
  // Redo operation
  const handleRedo = () => {
    if (historyManagerRef.current.redo(canvasRef.current)) {
      updateHistoryState();
    }
  };
  
  // Load template
  const handleSelectTemplate = async (template) => {
    try {
      setIsProcessing(true);
      setShowTemplates(false);
      
      // Load image to Canvas
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      const img = new Image();
      // Add cross-origin support
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        // Clear Canvas
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Fit image to canvas
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
        
        // Update history
        historyManagerRef.current.clear();
        historyManagerRef.current.addToHistory(canvas);
        updateHistoryState();
        
        setIsProcessing(false);
      };
      
      img.onerror = () => {
        console.error('Failed to load template image');
        setIsProcessing(false);
      };
      
      // Use actual template URL and add cache control
      const templateUrl = template.thumbnailUrl;
      img.src = templateUrl.includes('?') 
        ? `${templateUrl}&nocache=${new Date().getTime()}` 
        : `${templateUrl}?nocache=${new Date().getTime()}`;
      
    } catch (error) {
      console.error('Error loading template:', error);
      setIsProcessing(false);
    }
  };
  
  // Apply AI effect
  const handleApplyAIEffect = async (effectParams) => {
    try {
      setIsProcessing(true);
      
      const canvas = canvasRef.current;
      let imageData;
      
      try {
        imageData = canvas.toDataURL('image/png');
      } catch (error) {
        console.error('Unable to export Canvas data:', error);
        setIsProcessing(false);
        return;
      }
      
      const response = await fetch('/api/ai-effects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'apply-effect',
          imageData,
          effect: effectParams.effect,
          intensity: effectParams.intensity,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to apply AI effect');
      }
      
      // Apply processed image to Canvas
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Update history
        historyManagerRef.current.addToHistory(canvas);
        updateHistoryState();
        
        setIsProcessing(false);
      };
      
      img.src = data.imageData;
      
    } catch (error) {
      console.error('Error applying AI effect:', error);
      setIsProcessing(false);
    }
  };
  
  // Request color suggestions
  const handleRequestColorSuggestion = async () => {
    try {
      setShowColorSuggestions(true);
      setIsProcessing(true);
      
      const canvas = canvasRef.current;
      let imageData;
      
      try {
        imageData = canvas.toDataURL('image/png');
      } catch (error) {
        console.error('Unable to export Canvas data:', error);
        setIsProcessing(false);
        setShowColorSuggestions(false);
        alert('Unable to get color suggestions. This may be due to security restrictions from cross-origin images.');
        return;
      }
      
      const response = await fetch('/api/ai-effects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'suggest-colors',
          imageData,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get color suggestions');
      }
      
      setColorSuggestions(data.suggestions);
      
    } catch (error) {
      console.error('Error getting color suggestions:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Apply auto coloring
  const handleApplyAutoColoring = async () => {
    try {
      setIsProcessing(true);
      
      const canvas = canvasRef.current;
      let imageData;
      
      try {
        imageData = canvas.toDataURL('image/png');
      } catch (error) {
        console.error('Unable to export Canvas data:', error);
        setIsProcessing(false);
        alert('Unable to apply auto-coloring. This may be due to security restrictions from cross-origin images.');
        return;
      }
      
      const response = await fetch('/api/ai-effects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'auto-color',
          imageData,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to auto-color image');
      }
      
      // Apply processed image to Canvas
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Update history
        historyManagerRef.current.addToHistory(canvas);
        updateHistoryState();
        
        setIsProcessing(false);
      };
      
      img.src = data.imageData;
      
    } catch (error) {
      console.error('Error auto-coloring image:', error);
      setIsProcessing(false);
    }
  };
  
  // Handle color selection
  const handleColorSelect = (colorOrPalette) => {
    if (typeof colorOrPalette === 'string') {
      // Single color
      setBrushColor(colorOrPalette);
    } else {
      // Color palette
      setBrushColor(colorOrPalette.colors[0]);
    }
    
    setShowColorSuggestions(false);
  };
  
  // Handle AI brush selection
  const handleSelectAIBrush = (brushSettings) => {
    setAIBrush(brushSettings);
    setActiveBrush(brushSettings.type);
  };
  
  return (
    <MainLayout
      title="Magic Coloring Studio | Ghibli Style Coloring Tool"
      backgroundImage={backgroundImagePath}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md text-gradient-primary">
            Magic Coloring Studio
          </h1>
          <div className="ml-auto mr-4 flex items-center">
            <button
              onClick={handleSaveToAccount}
              className="mr-4 ghibli-button-accent flex items-center px-6 py-2"
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
              ) : (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save to Gallery
                </span>
              )}
            </button>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="ghibli-button flex items-center px-6 py-2"
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {showTemplates ? 'Close Template' : 'Browse Templates'}
              </span>
            </button>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left toolbar */}
          <div className="lg:col-span-3 space-y-4">
            <Toolbar
              brushSize={brushSize}
              onBrushSizeChange={setBrushSize}
              brushColor={brushColor}
              onBrushColorChange={setBrushColor}
              mode={mode}
              onModeChange={setMode}
              onSave={handleSave}
              onClear={handleClear}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={canUndo}
              canRedo={canRedo}
              onToggleAIBrushTools={() => setShowAIBrushTools(!showAIBrushTools)}
            />
            
            <div className="ghibli-card-gradient">
              {showAIBrushTools ? (
                <AIBrushTools
                  onSelectBrush={handleSelectAIBrush}
                  activeBrush={activeBrush}
                  isProcessing={isProcessing}
                />
              ) : (
                <AITools
                  onApplyAIEffect={handleApplyAIEffect}
                  onRequestColorSuggestion={handleRequestColorSuggestion}
                  onApplyAutoColoring={handleApplyAutoColoring}
                  isProcessing={isProcessing}
                />
              )}
            </div>
          </div>
          
          {/* Central canvas area */}
          <div className="lg:col-span-9 relative">
            <Canvas
              width={800}
              height={800}
              brushSize={brushSize}
              brushColor={brushColor}
              mode={mode}
              aiBrush={aiBrush}
              onDraw={handleDraw}
              canvasRef={canvasRef}
              className="w-full shadow-ghibli-lg bg-white mx-auto rounded-xl border-4 border-white"
            />
            
            {isProcessing && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-xl">
                <div className="bg-white p-6 rounded-xl shadow-ghibli-lg text-center">
                  <svg className="animate-spin h-12 w-12 text-ghibli-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gradient-primary font-bold text-xl mb-2">AI Magic in Progress</p>
                  <p className="text-ghibli-dark-brown/70">Creating something wonderful...</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Template selector */}
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 ghibli-card-gradient p-4 rounded-xl"
          >
            <TemplateSelector onSelectTemplate={handleSelectTemplate} />
          </motion.div>
        )}
        
        {/* Color suggestions modal */}
        <ColorSuggestions
          isVisible={showColorSuggestions}
          onClose={() => setShowColorSuggestions(false)}
          onSelect={handleColorSelect}
          isLoading={isProcessing}
          suggestions={colorSuggestions}
        />
        
        {/* Save artwork modal */}
        <SaveArtworkModal 
          isVisible={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          onSave={handleSaveToAccount}
          imageData={canvasRef.current ? canvasRef.current.toDataURL('image/png') : null}
          isProcessing={isSaving}
        />
      </div>
    </MainLayout>
  );
} 