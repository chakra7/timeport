import { NextRequest, NextResponse } from 'next/server';
import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';

export async function POST(request: NextRequest) {
  try {
    const { place, year } = await request.json();
    
    if (!place || !year) {
      return NextResponse.json(
        { error: 'Place and year are required' },
        { status: 400 }
      );
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
    const jsonMatch = fullText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      return NextResponse.json(data);
    } else {
      return NextResponse.json({
        weather: "Mild and temperate",
        language: "Unknown dialects",
        population: "Unknown",
        lifeExpectancy: "Average lifespan",
        context: "Life continues in mysterious ways."
      });
    }
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate prediction',
        weather: "Unknown",
        language: "Unknown",
        population: "Unknown",
        lifeExpectancy: "Unknown"
      },
      { status: 500 }
    );
  }
}
