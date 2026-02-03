import type { Place, ApiPredictionResponse } from '@/types';

export async function fetchPrediction(place: Place, year: number): Promise<ApiPredictionResponse> {
  const response = await fetch('/api/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ place, year }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export async function fetchVisualization(prompt: string): Promise<{ imageUrls: string[] }> {
  const response = await fetch('/api/visualize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

