import { NextRequest, NextResponse } from 'next/server';
import { generateEraImage } from '@/lib/imageGen';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Generate 4 highly distinct types of images in parallel
    const variations = [
      { 
        desc: "A breathtaking wide-angle panoramic aerial view showing the scale and landscape of",
        weight: "panoramic, wide-angle, birds-eye view"
      },
      { 
        desc: "A bustling, crowded street-level candid scene showing daily life, people, and local fashion in",
        weight: "street photography, busy, people, life-like"
      },
      { 
        desc: "A majestic, detailed architectural portrait focusing on a specific grand building or monument in",
        weight: "architecture, monument, majestic, heroic shot"
      },
      { 
        desc: "An atmospheric, moody close-up focusing on specific tools, technology, or interior domestic details of",
        weight: "macro, detail, interior, technology, textures"
      }
    ];

    const imagePromises = variations.map((v, i) => 
      generateEraImage(`${v.desc} ${prompt}. Style: ${v.weight}`, Math.floor(Math.random() * 1000000) + i)
    );
    
    const imageUrls = await Promise.all(imagePromises);
    const validImageUrls = imageUrls.filter((url): url is string => url !== null);
    
    return NextResponse.json({ imageUrls: validImageUrls });
  } catch (error) {
    console.error('Visualization error:', error);
    return NextResponse.json({ error: 'Failed to generate visualization' }, { status: 500 });
  }
}
