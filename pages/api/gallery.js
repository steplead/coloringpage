import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Gallery data file path
const galleryJsonPath = path.join(process.cwd(), 'public', 'gallery.json');

// Create directories
const ensureDirectories = () => {
  // Create artworks directory if it doesn't exist
  const artworksDir = path.join(process.cwd(), 'public', 'artworks');
  if (!fs.existsSync(artworksDir)) {
    fs.mkdirSync(artworksDir, { recursive: true });
  }
  
  // Ensure gallery.json file exists
  if (!fs.existsSync(galleryJsonPath)) {
    fs.writeFileSync(galleryJsonPath, JSON.stringify({ artworks: [] }));
  }
};

// Get all artworks from gallery.json
const getGalleryArtworks = () => {
  ensureDirectories();
  try {
    const data = fs.readFileSync(galleryJsonPath, 'utf8');
    return JSON.parse(data).artworks || [];
  } catch (error) {
    console.error('Failed to read gallery data:', error);
    return [];
  }
};

// Save artworks to gallery.json
const saveGalleryArtworks = (artworks) => {
  try {
    fs.writeFileSync(galleryJsonPath, JSON.stringify({ artworks }, null, 2));
    return true;
  } catch (error) {
    console.error('Failed to save gallery data:', error);
    return false;
  }
};

// Save Base64 image to file system
const saveImageToFile = (base64Image, artworkId) => {
  ensureDirectories();
  
  try {
    // Remove the data:image/png;base64, prefix
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Create artwork directory if it doesn't exist
    const artworkDir = path.join(process.cwd(), 'public', 'artworks', artworkId);
    if (!fs.existsSync(artworkDir)) {
      fs.mkdirSync(artworkDir, { recursive: true });
    }
    
    // Save main image
    const imagePath = path.join(artworkDir, 'image.png');
    fs.writeFileSync(imagePath, buffer);
    
    return `/artworks/${artworkId}/image.png`;
  } catch (error) {
    console.error('Failed to save image:', error);
    return null;
  }
};

// Save thumbnail to file system
const saveThumbnailToFile = (thumbnail, artworkId) => {
  ensureDirectories();
  
  try {
    // Remove the data:image/png;base64, prefix
    const base64Data = thumbnail.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Create thumbnails directory if it doesn't exist
    const thumbnailsDir = path.join(process.cwd(), 'public', 'artworks', artworkId, 'thumbnails');
    if (!fs.existsSync(thumbnailsDir)) {
      fs.mkdirSync(thumbnailsDir, { recursive: true });
    }
    
    // Save thumbnail
    const thumbnailPath = path.join(thumbnailsDir, 'thumbnail.png');
    fs.writeFileSync(thumbnailPath, buffer);
    
    return `/artworks/${artworkId}/thumbnails/thumbnail.png`;
  } catch (error) {
    console.error('Failed to save thumbnail:', error);
    return null;
  }
};

export default function handler(req, res) {
  if (req.method === 'GET') {
    return getArtworks(req, res);
  } else if (req.method === 'POST') {
    return saveArtwork(req, res);
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}

// Get public gallery artworks
async function getArtworks(req, res) {
  const artworks = getGalleryArtworks();
  return res.status(200).json({ artworks });
}

// Save new artwork to public gallery
async function saveArtwork(req, res) {
  try {
    const { title, description, image_data, thumbnail } = req.body;
    
    if (!image_data) {
      return res.status(400).json({ error: 'Image data is required' });
    }
    
    // Generate unique ID
    const artworkId = uuidv4();
    
    // Save image and thumbnail
    const imageUrl = saveImageToFile(image_data, artworkId);
    const thumbnailUrl = thumbnail ? saveThumbnailToFile(thumbnail, artworkId) : null;
    
    if (!imageUrl) {
      return res.status(500).json({ error: 'Failed to save image' });
    }
    
    // Create artwork object
    const artwork = {
      id: artworkId,
      title: title || 'Untitled Artwork',
      description: description || '',
      imageUrl,
      thumbnailUrl,
      createdAt: new Date().toISOString()
    };
    
    // Add to gallery
    const artworks = getGalleryArtworks();
    artworks.unshift(artwork); // Add to the beginning
    
    // Save updated artwork list
    saveGalleryArtworks(artworks);
    
    return res.status(200).json({ success: true, artwork });
    
  } catch (error) {
    console.error('Failed to save artwork:', error);
    return res.status(500).json({ error: 'Failed to save artwork', details: error.message });
  }
} 