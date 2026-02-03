import { NextRequest, NextResponse } from 'next/server';
import { generateEraImage } from '@/lib/imageGen';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Generate 4 images in parallel
    const imagePromises = Array.from({ length: 4 }).map((_, i) => 
      generateEraImage(`${prompt} variation ${i + 1}`)
    );
    
    const imageUrls = await Promise.all(imagePromises);
    const validImageUrls = imageUrls.filter((url): url is string => url !== null);
    
    return NextResponse.json({ imageUrls: validImageUrls });
  } catch (error) {
    console.error('Visualization error:', error);
    return NextResponse.json({ error: 'Failed to generate visualization' }, { status: 500 });
  }
}
