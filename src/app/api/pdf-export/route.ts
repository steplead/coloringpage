import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { imageUrl, title } = body;
    
    // Validate the required fields
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }
    
    // In a production environment, you would use a proper PDF library
    // Such as jsPDF, PDFKit, or a server-side PDF generator
    // For this demo, we'll just redirect to the image URL directly
    
    try {
      // Fetch the image directly
      const imageResponse = await fetch(imageUrl);
      
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.status}`);
      }
      
      // Get image as array buffer
      const imageBuffer = await imageResponse.arrayBuffer();
      
      // Get the file extension from the URL or default to .png
      const fileExtension = imageUrl.split('.').pop()?.toLowerCase() || 'png';
      const mimeType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;
      
      // Create a clean filename
      const cleanTitle = (title || 'coloring-page')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .substring(0, 50);
      
      // Return the image with download headers
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': mimeType,
          'Content-Disposition': `attachment; filename="${cleanTitle}.${fileExtension}"`,
          'Cache-Control': 'no-cache',
        },
      });
      
    } catch (error) {
      console.error('Image fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to process image' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('PDF export error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
} 