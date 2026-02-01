/**
 * Generates an image representing the time and place.
 * Currently using Pollinations.ai (Free, no API key required) as a cost-effective start.
 * To use Gemini Imagen 4 later, restore the google.image implementation.
 */
export async function generateEraImage(prompt: string) {
  try {
    // Pollinations.ai provides a free, no-key-required image generation API.
    // It's excellent for rapid prototyping and "cheaper" (free) initial development.
    const encodedPrompt = encodeURIComponent(`high-quality, realistic, cinematic wide-shot of: ${prompt}. Atmospheric lighting, historically accurate details, 8k resolution.`);
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=576&nologo=true&seed=${seed}`;

    // Return the URL directly. The frontend <img> tag will handle fetching it.
    return imageUrl;
  } catch (error) {
    console.error('Image generation error:', error);
    return null;
  }
}

/* 
// Gemini Imagen 4 Implementation (Requires Paid API Key)
import { google } from '@ai-sdk/google';
import { experimental_generateImage as generateImage } from 'ai';

export async function generateEraImageGemini(prompt: string) {
  try {
    const { image } = await generateImage({
      model: google.image('imagen-4.0-generate-001'),
      prompt: `A high-quality, realistic, cinematic wide-shot of: ${prompt}. Atmospheric lighting, historically accurate details, 8k resolution.`,
    });
    return `data:image/png;base64,${image.base64}`;
  } catch (error) {
    console.error('Gemini image generation error:', error);
    return null;
  }
}
*/
