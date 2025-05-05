import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Canvas Engine Component
 * Provides drawing functionality with enhanced AI brush support
 */
const Canvas = ({ 
  width = 800, 
  height = 800, 
  backgroundImage = null,
  onDraw = () => {},
  className = '',
  brushSize = 5,
  brushColor = '#000000',
  mode = 'draw', // draw, erase, fill
  aiBrush = { type: 'standard', intensity: 0.7 }, // AI brush settings
  canvasRef = null,
}) => {
  const innerCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const tempCanvasRef = useRef(null); // For AI brush effects
  
  // Use provided ref or internal ref
  const actualCanvasRef = canvasRef || innerCanvasRef;
  
  // Initialize canvas
  useEffect(() => {
    const canvas = actualCanvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Initialize temp canvas for AI effects
    if (!tempCanvasRef.current) {
      tempCanvasRef.current = document.createElement('canvas');
      tempCanvasRef.current.width = width;
      tempCanvasRef.current.height = height;
    }
    
    // Load background image if provided
    if (backgroundImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.onerror = (error) => {
        console.error('Background image failed to load:', error);
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
      };
      img.src = backgroundImage;
    }
  }, [width, height, backgroundImage, actualCanvasRef]);
  
  // Update brush properties when they change
  useEffect(() => {
    const canvas = actualCanvasRef.current;
    const context = canvas.getContext('2d');
    
    context.lineWidth = brushSize;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.strokeStyle = brushColor;
  }, [brushSize, brushColor, actualCanvasRef]);
  
  // Drawing functions
  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    setIsDrawing(true);
    setLastPosition({ x: offsetX, y: offsetY });
  };
  
  const draw = (e) => {
    if (!isDrawing) return;
    
    const { offsetX, offsetY } = getCoordinates(e);
    const canvas = actualCanvasRef.current;
    const context = canvas.getContext('2d');
    
    context.beginPath();
    
    if (mode === 'draw') {
      // Apply the appropriate drawing method based on AI brush type
      if (aiBrush.type === 'standard') {
        // Standard brush - regular drawing
        context.globalCompositeOperation = 'source-over';
        context.moveTo(lastPosition.x, lastPosition.y);
        context.lineTo(offsetX, offsetY);
        context.stroke();
      } else {
        // AI-enhanced brushes
        applyAIBrushEffect(context, lastPosition, { x: offsetX, y: offsetY });
      }
    } else if (mode === 'erase') {
      context.globalCompositeOperation = 'destination-out';
      context.moveTo(lastPosition.x, lastPosition.y);
      context.lineTo(offsetX, offsetY);
      context.stroke();
    }
    
    setLastPosition({ x: offsetX, y: offsetY });
    onDraw(canvas);
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
  };
  
  // Apply AI brush effects
  const applyAIBrushEffect = (context, start, end) => {
    context.globalCompositeOperation = 'source-over';
    
    switch (aiBrush.type) {
      case 'smart-color':
        // Smart color adjusts based on surrounding colors
        applySmartColorBrush(context, start, end);
        break;
        
      case 'texture':
        // Texture brush adds patterns
        applyTextureBrush(context, start, end);
        break;
        
      case 'blend':
        // Blend brush for smooth transitions
        applyBlendBrush(context, start, end);
        break;
        
      case 'shade':
        // Smart shade for automatic shading
        applyShaderBrush(context, start, end);
        break;
        
      case 'pattern':
        // Pattern brush fills with patterns
        applyPatternBrush(context, start, end);
        break;
        
      default:
        // Default to standard brush
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.stroke();
    }
  };
  
  // Smart color brush implementation
  const applySmartColorBrush = (context, start, end) => {
    // Base stroke
    context.save();
    context.shadowColor = brushColor;
    context.shadowBlur = brushSize * aiBrush.intensity * 2;
    
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
    
    context.restore();
  };
  
  // Texture brush implementation
  const applyTextureBrush = (context, start, end) => {
    const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    
    const steps = Math.max(Math.floor(distance), 1);
    const stepSize = distance / steps;
    
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const x = start.x + (end.x - start.x) * t;
      const y = start.y + (end.y - start.y) * t;
      
      // Draw texture dots with varying sizes
      const dotSize = (Math.random() * 0.5 + 0.5) * brushSize * aiBrush.intensity;
      
      context.beginPath();
      context.arc(x, y, dotSize, 0, Math.PI * 2);
      context.fillStyle = brushColor;
      context.fill();
      
      // Add some noise/variation for texture
      for (let j = 0; j < 3; j++) {
        const noiseX = x + (Math.random() * 2 - 1) * brushSize;
        const noiseY = y + (Math.random() * 2 - 1) * brushSize;
        const noiseSize = Math.random() * brushSize * 0.5 * aiBrush.intensity;
        
        context.beginPath();
        context.arc(noiseX, noiseY, noiseSize, 0, Math.PI * 2);
        
        // Slight variation in color
        const r = parseInt(brushColor.slice(1, 3), 16);
        const g = parseInt(brushColor.slice(3, 5), 16);
        const b = parseInt(brushColor.slice(5, 7), 16);
        
        const variation = 15;
        const newR = Math.min(255, Math.max(0, r + (Math.random() * variation * 2 - variation)));
        const newG = Math.min(255, Math.max(0, g + (Math.random() * variation * 2 - variation)));
        const newB = Math.min(255, Math.max(0, b + (Math.random() * variation * 2 - variation)));
        
        context.fillStyle = `rgb(${newR}, ${newG}, ${newB})`;
        context.fill();
      }
    }
  };
  
  // Blend brush implementation
  const applyBlendBrush = (context, start, end) => {
    context.save();
    context.globalAlpha = 0.4 * aiBrush.intensity;  // Lower opacity for blending
    
    // Main stroke
    context.beginPath();
    context.lineWidth = brushSize;
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
    
    // Add softer, wider strokes for blending effect
    context.globalAlpha = 0.2 * aiBrush.intensity;
    context.lineWidth = brushSize * 1.5;
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
    
    context.globalAlpha = 0.1 * aiBrush.intensity;
    context.lineWidth = brushSize * 2.5;
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
    
    context.restore();
  };
  
  // Shader brush implementation
  const applyShaderBrush = (context, start, end) => {
    const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const perpAngle = angle + Math.PI / 2;
    
    // Main color
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.lineWidth = brushSize;
    context.stroke();
    
    // Add shading lines
    context.save();
    context.globalAlpha = 0.3 * aiBrush.intensity;
    
    // Darken the brush color for shading
    const r = parseInt(brushColor.slice(1, 3), 16);
    const g = parseInt(brushColor.slice(3, 5), 16);
    const b = parseInt(brushColor.slice(5, 7), 16);
    
    // Darken by 30%
    const darkenFactor = 0.7;
    const shadeColor = `rgb(${Math.floor(r*darkenFactor)}, ${Math.floor(g*darkenFactor)}, ${Math.floor(b*darkenFactor)})`;
    
    context.strokeStyle = shadeColor;
    context.lineWidth = brushSize * 0.7;
    
    const shadeLength = brushSize * 1.5 * aiBrush.intensity;
    const startOffsetX = Math.cos(perpAngle) * brushSize * 0.5;
    const startOffsetY = Math.sin(perpAngle) * brushSize * 0.5;
    
    context.beginPath();
    context.moveTo(start.x + startOffsetX, start.y + startOffsetY);
    context.lineTo(end.x + startOffsetX, end.y + startOffsetY);
    context.stroke();
    
    context.restore();
  };
  
  // Pattern brush implementation
  const applyPatternBrush = (context, start, end) => {
    const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    
    const steps = Math.max(Math.floor(distance), 1);
    const stepSize = distance / steps;
    
    // Choose pattern based on intensity
    const patternType = Math.floor(aiBrush.intensity * 3); // 0-2 pattern types
    
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const x = start.x + (end.x - start.x) * t;
      const y = start.y + (end.y - start.y) * t;
      
      switch(patternType) {
        case 0: // Dots pattern
          if (i % 2 === 0) {
            context.beginPath();
            context.arc(x, y, brushSize * 0.6, 0, Math.PI * 2);
            context.fillStyle = brushColor;
            context.fill();
          }
          break;
          
        case 1: // Cross-hatch pattern
          if (i % 3 === 0) {
            context.beginPath();
            context.moveTo(x - brushSize * 0.5, y - brushSize * 0.5);
            context.lineTo(x + brushSize * 0.5, y + brushSize * 0.5);
            context.moveTo(x + brushSize * 0.5, y - brushSize * 0.5);
            context.lineTo(x - brushSize * 0.5, y + brushSize * 0.5);
            context.strokeStyle = brushColor;
            context.lineWidth = brushSize * 0.3;
            context.stroke();
          }
          break;
          
        case 2: // Zigzag pattern
          context.beginPath();
          if (i % 2 === 0) {
            context.moveTo(x, y - brushSize * 0.5);
            context.lineTo(x, y + brushSize * 0.5);
          } else {
            context.moveTo(x - brushSize * 0.5, y);
            context.lineTo(x + brushSize * 0.5, y);
          }
          context.strokeStyle = brushColor;
          context.lineWidth = brushSize * 0.4;
          context.stroke();
          break;
      }
    }
  };
  
  // Calculate coordinates for both mouse and touch events
  const getCoordinates = (e) => {
    if (e.nativeEvent.offsetX !== undefined) {
      return { offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY };
    }
    
    // For touch events
    const touch = e.touches[0] || e.changedTouches[0];
    const rect = e.target.getBoundingClientRect();
    return {
      offsetX: touch.clientX - rect.left,
      offsetY: touch.clientY - rect.top
    };
  };
  
  // Fill function
  const handleFill = (e) => {
    if (mode !== 'fill') return;
    
    const { offsetX, offsetY } = getCoordinates(e);
    const canvas = actualCanvasRef.current;
    const context = canvas.getContext('2d');
    
    // Fill with patterns based on AI brush settings
    if (aiBrush.type === 'pattern' && aiBrush.intensity > 0.3) {
      applyPatternFill(context, offsetX, offsetY, brushColor);
    } else {
      // Standard flood fill
      floodFill(context, offsetX, offsetY, brushColor);
    }
    onDraw(canvas);
  };
  
  // Pattern fill implementation
  const applyPatternFill = (context, x, y, fillColor) => {
    // For demonstration, fill a circle with the pattern
    const patternSize = brushSize * 2 * aiBrush.intensity;
    
    context.fillStyle = fillColor;
    context.beginPath();
    context.arc(x, y, patternSize * 4, 0, Math.PI * 2);
    context.fill();
    
    // Add pattern overlay
    const patternType = Math.floor(aiBrush.intensity * 3); // 0-2 pattern types
    
    context.save();
    context.globalCompositeOperation = 'source-atop';
    
    // Create pattern based on type
    switch(patternType) {
      case 0: // Dots
        for (let i = -patternSize*4; i <= patternSize*4; i += patternSize) {
          for (let j = -patternSize*4; j <= patternSize*4; j += patternSize) {
            if (Math.sqrt(i*i + j*j) <= patternSize*4) {
              context.beginPath();
              context.arc(x + i, y + j, patternSize * 0.3, 0, Math.PI * 2);
              context.fillStyle = '#ffffff';
              context.globalAlpha = 0.2;
              context.fill();
            }
          }
        }
        break;
        
      case 1: // Stripes
        context.strokeStyle = '#ffffff';
        context.globalAlpha = 0.15;
        context.lineWidth = patternSize * 0.2;
        
        for (let i = -patternSize*4; i <= patternSize*4; i += patternSize) {
          context.beginPath();
          context.moveTo(x - patternSize*4, y + i);
          context.lineTo(x + patternSize*4, y + i);
          context.stroke();
        }
        break;
        
      case 2: // Radial
        const gradient = context.createRadialGradient(x, y, 0, x, y, patternSize*4);
        gradient.addColorStop(0, fillColor);
        gradient.addColorStop(0.7, fillColor);
        gradient.addColorStop(1, '#ffffff');
        
        context.globalAlpha = 0.9;
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(x, y, patternSize*4, 0, Math.PI * 2);
        context.fill();
        break;
    }
    
    context.restore();
  };
  
  // Simplified flood fill implementation
  const floodFill = (context, x, y, fillColor) => {
    // This is a placeholder for a more sophisticated flood fill algorithm
    // A production app would use a more efficient algorithm
    const targetColor = context.getImageData(x, y, 1, 1).data;
    
    // For now, just fill a small circle as a demonstration
    context.fillStyle = fillColor;
    context.beginPath();
    context.arc(x, y, brushSize * 2, 0, Math.PI * 2);
    context.fill();
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative overflow-hidden rounded-xl border-2 border-ghibli-light-brown/30 ${className}`}
    >
      <canvas
        ref={actualCanvasRef}
        width={width}
        height={height}
        className="touch-none cursor-crosshair max-w-full"
        style={{ background: '#ffffff' }}
        onMouseDown={mode === 'fill' ? handleFill : startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={mode === 'fill' ? handleFill : startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </motion.div>
  );
};

export default Canvas; 