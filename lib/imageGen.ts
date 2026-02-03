import { google } from '@ai-sdk/google';
import { experimental_generateImage as generateImage } from 'ai';

/**
 * Generates an image representing the time and place using Gemini (Imagen 4 Fast).
 * This is a cost-effective, high-speed variant of the Imagen 4 model.
 * Requires GOOGLE_GENERATIVE_AI_API_KEY in .env
 */
export async function generateEraImage(prompt: string) {
  try {
    // Ensure GOOGLE_GENERATIVE_AI_API_KEY is set in .env
    const { image } = await generateImage({
      model: google.image('imagen-4.0-fast-generate-001'),
      prompt: `A high-quality, realistic, cinematic wide-shot of: ${prompt}. Atmospheric lighting, historically accurate details, 8k resolution.`,
    });

    return `data:image/png;base64,${image.base64}`;
  } catch (error) {
    console.error('Image generation error:', error);
    // Fallback to Pollinations for development if Gemini fails
    const encodedPrompt = encodeURIComponent(prompt);
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=576&nologo=true`;
  }
}
