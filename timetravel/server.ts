import express, { Request, Response } from 'express';
import cors from 'cors';
import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the project root (where server.ts is located)
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// API endpoint for predictions
app.post('/api/predict', async (req: Request, res: Response) => {
  try {
    const { place, year } = req.body;
    
    if (!place || !year) {
      return res.status(400).json({ error: 'Place and year are required' });
    }

    const prompt = `You are a creative historical and futuristic prediction engine. Given a location and year, predict realistic but creative data about that time and place.

Location: ${place.name}
Year: ${year}
Region: ${place.region}
Terrain: ${place.terrain}

Provide the following in JSON format:
{
  "weather": "Description of current weather conditions",
  "language": "Primary language(s) spoken with any notable characteristics",
  "population": "Population estimate or description",
  "lifeExpectancy": "Average life expectancy with context",
  "context": "A vivid 2-3 sentence description of what life is like there"
}

Make the predictions imaginative but grounded in historical trends or logical future extrapolation. Be specific and evocative. Do not explain that these are predictions - present them as factual statements about that time/place.`;

    const result = await streamText({
      model: groq('llama-3.3-70b-versatile'),
      messages: [
        {
          role: 'system',
          content: 'You are a creative historical prediction engine. Generate plausible but imaginative data about any time and place on Earth.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
    });

    // Collect the full response
    let fullText = '';
    for await (const delta of result.textStream) {
      fullText += delta;
    }

    // Parse the JSON from the response
    // The response might have markdown code blocks, so extract JSON
    const jsonMatch = fullText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      res.json(data);
    } else {
      // Fallback if JSON parsing fails
      res.json({
        weather: "Mild and temperate",
        language: "Unknown dialects",
        population: "Unknown",
        lifeExpectancy: "Average lifespan",
        context: "Life continues in mysterious ways."
      });
    }
  } catch (error) {
    console.error('Prediction error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    res.status(500).json({ 
      error: 'Failed to generate prediction',
      weather: "Unknown",
      language: "Unknown",
      population: "Unknown",
      lifeExpectancy: "Unknown"
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/predict`);
  
  // Verify API key is loaded (mask it for security)
  const apiKey = process.env.GROQ_API_KEY;
  if (apiKey) {
    const maskedKey = apiKey.substring(0, 7) + '...' + apiKey.substring(apiKey.length - 4);
    console.log(`Groq API Key loaded: ${maskedKey}`);
  } else {
    console.error('WARNING: GROQ_API_KEY not found in environment variables!');
    console.error('Get your free API key at: https://console.groq.com/keys');
  }
});
